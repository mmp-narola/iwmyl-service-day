import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Control, FieldValues, Path, RegisterOptions } from "react-hook-form";

export interface DropdownOption {
  label: string;
  value: string;
}

type DropdownValue = string | string[] | null;

interface CustomDropdownProps<T extends FieldValues = FieldValues> {
  control?: Control<T>;
  name?: Path<T>;
  label?: string;
  placeholder?: string;
  options?: DropdownOption[];
  value?: string | string[] | null;
  onChange?: (value: string | string[] | null) => void;
  required?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  searchable?: boolean;
  className?: string;
  wrapperClassName?: string;
  loadOptions?: (input: string) => Promise<DropdownOption[]>;
  debounceMs?: number;
  showTickmark?: boolean;
  onOptionSelect?: (option: DropdownOption | DropdownOption[] | null) => void;
  rules?: RegisterOptions;
  disabled?: boolean;
  dropdownWidthClassName?: string;
}

function useDebounce<T>(value: T, delay = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function CustomDropdown<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = "Select",
  options = [],
  value,
  onChange,
  required = false,
  isClearable = false,
  isMulti = false,
  searchable = false,
  className = "",
  loadOptions,
  debounceMs = 500,
  showTickmark = true,
  onOptionSelect,
  rules,
  disabled = false,
  wrapperClassName = "",
  dropdownWidthClassName,
}: CustomDropdownProps<T>) {
  const isHookForm = Boolean(control && name);

  const [open, setOpen] = useState<boolean>(false);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [asyncOptions, setAsyncOptions] = useState<DropdownOption[]>(options);
  const [selectedOptionMap, setSelectedOptionMap] = useState<
    Record<string, DropdownOption>
  >({});

  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);
  const loadRef = useRef<typeof loadOptions>(loadOptions);

  const debouncedSearch = useDebounce(search, debounceMs);

  useEffect(() => {
    loadRef.current = loadOptions;
  }, [loadOptions]);

  const normalizeValue = (
    val: string | string[] | null | undefined,
  ): string | string[] | null =>
    isMulti ? (Array.isArray(val) ? val : []) : (val ?? null);

  const toggleValue = (
    current: string[] | string | null,
    val: string,
  ): string | string[] | null => {
    if (!isMulti) return val;

    const currentArray = Array.isArray(current) ? current : [];
    return currentArray.includes(val)
      ? currentArray.filter((v) => v !== val)
      : [...currentArray, val];
  };

  const removeValue = (current: string[], val: string) =>
    current.filter((v) => v !== val);

  const clearValue = (cb: (val: any) => void) => cb(isMulti ? [] : null);

  const getOptionByValue = (val: string): DropdownOption | undefined =>
    selectedOptionMap[val] ||
    asyncOptions.find((o) => o.value === val) ||
    options.find((o) => o.value === val);

  useEffect(() => {
    if (!searchable || !loadOptions) return;

    const term = debouncedSearch.trim();
    if (!term) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    loadRef
      .current?.(term)
      .then((data) => {
        if (active) setAsyncOptions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (active) setAsyncOptions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, searchable]);

  const resolvedOptions: DropdownOption[] = (() => {
    if (searchable && loadOptions) {
      return search.trim() ? asyncOptions : options;
    }

    if (searchable) {
      return options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase()),
      );
    }

    return options;
  })();

  //   useEffect(() => {
  //     if (open) {
  //       setActiveIndex(0);
  //       requestAnimationFrame(() => listRef.current?.focus());
  //     }
  //     // else {
  //     //   setSearch('');
  //     // }
  //   }, [open]);

  //   useEffect(() => {
  //     optionRefs.current[activeIndex]?.scrollIntoView({
  //       block: "nearest",
  //     });
  //   }, [activeIndex]);

  /* ------------------------ Keyboard ------------------------ */

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
    }
  };

  const handleListKeyDown = (
    e: React.KeyboardEvent<HTMLDivElement>,
    selectedValue: string | string[] | null,
    cb: (val: any) => void,
  ) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((p) => (p < resolvedOptions.length - 1 ? p + 1 : 0));
        break;

      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((p) => (p > 0 ? p - 1 : resolvedOptions.length - 1));
        break;

      case "Enter": {
        e.preventDefault();
        const opt = resolvedOptions[activeIndex];
        if (!opt) return;

        const updatedValue = toggleValue(selectedValue, opt.value);
        cb(updatedValue);

        setSelectedOptionMap((prev) => ({
          ...prev,
          [opt.value]: opt,
        }));

        if (isMulti) {
          const selectedOptions = (updatedValue as string[])
            .map((v) => getOptionByValue(v))
            .filter((opt): opt is DropdownOption => !!opt);
          onOptionSelect?.(selectedOptions);
        } else {
          onOptionSelect?.(opt);
          setOpen(false);
        }
        break;
      }

      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
    }
  };

  const renderTrigger = (
    selectedValue: DropdownValue,
    error: boolean | undefined,
    cb: (value: DropdownValue) => void,
  ) => (
    <PopoverTrigger asChild>
      <button
        type="button"
        disabled={disabled}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "w-full min-h-10 border rounded-md px-3 py-1 flex items-center justify-between text-sm bg-background focus:outline-none focus-within:ring-1 focus-within:ring-primary focus:border-none",
          error ? "border-red-500" : "border-input",
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-zinc-800"
            : "",
          className,
        )}
      >
        <div className="flex flex-wrap gap-1 flex-1 text-left min-w-0">
          {isMulti ? (
            Array.isArray(selectedValue) && selectedValue.length > 0 ? (
              selectedValue.map((val: string) => {
                const opt = getOptionByValue(val);
                return (
                  <span
                    key={val}
                    className="flex items-center gap-1 bg-primary/30 px-2 py-0.5 rounded text-xs"
                  >
                    {opt?.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        const updated = removeValue(selectedValue, val);
                        cb(updated);
                        setSelectedOptionMap((prev) => {
                          const copy = { ...prev };
                          delete copy[val];
                          return copy;
                        });

                        const selectedOptions = updated
                          .map((v) => getOptionByValue(v))
                          .filter((opt): opt is DropdownOption => !!opt);
                        onOptionSelect?.(selectedOptions);
                      }}
                    />
                  </span>
                );
              })
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )
          ) : (
            <span className="truncate block w-full">
              {selectedValue
                ? getOptionByValue(selectedValue as string)?.label
                : placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          {isClearable &&
            ((isMulti &&
              Array.isArray(selectedValue) &&
              selectedValue.length > 0) ||
              (!isMulti && !!selectedValue)) && (
              <X
                className="h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  clearValue(cb);
                  setSelectedOptionMap({});
                  onOptionSelect?.(isMulti ? [] : null);
                }}
              />
            )}
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>
    </PopoverTrigger>
  );

  const renderOptions = (
    selectedValue: DropdownValue,
    cb: (value: DropdownValue) => void,
  ) => (
    <PopoverContent
      align="start"
      className={cn(
        "p-0 w-[var(--radix-popover-trigger-width)]",
        dropdownWidthClassName,
      )}
    >
      {searchable && (
        <div className="p-2 border-b">
          <input
            autoFocus
            value={search}
            placeholder="Search..."
            onChange={(e) => {
              setSearch(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(e) => e.stopPropagation()}
            className="w-full h-8 px-2 text-sm border rounded-md bg-background outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      )}

      <div
        ref={listRef}
        tabIndex={-1}
        role="listbox"
        className="max-h-56 overflow-auto py-1 outline-none"
        onKeyDown={(e) => handleListKeyDown(e, selectedValue, cb)}
      >
        {loading ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            Loading...
          </div>
        ) : resolvedOptions.length === 0 ? (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            No data available
          </div>
        ) : (
          resolvedOptions.map((opt: DropdownOption, index: number) => {
            const selected = isMulti
              ? Array.isArray(selectedValue) && selectedValue.includes(opt.value)
              : selectedValue === opt.value;

            return (
              <div
                key={opt.value}
                ref={(el) => {
                  optionRefs.current[index] = el;
                  return;
                }}
                className={cn(
                  "flex items-center px-3 py-2 text-sm cursor-pointer justify-between capitalize",
                  selected && "bg-primary/10",
                  index === activeIndex && "bg-primary/20",
                )}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  const updatedValue = toggleValue(selectedValue, opt.value);
                  cb(updatedValue);
                  setSelectedOptionMap((prev) => ({
                    ...prev,
                    [opt.value]: opt,
                  }));

                  if (isMulti) {
                    const selectedOptions = (updatedValue as string[])
                      .map((v) => getOptionByValue(v))
                      .filter((opt): opt is DropdownOption => !!opt);
                    onOptionSelect?.(selectedOptions);
                  } else {
                    onOptionSelect?.(opt);
                    setOpen(false);
                  }
                }}
              >
                {opt.label}
                {showTickmark && selected && (
                  <Check className="h-4 w-4 text-primary mr-2" />
                )}
              </div>
            );
          })
        )}
      </div>
    </PopoverContent>
  );

  if (!isHookForm) {
    const normalizedValue = normalizeValue(value);

    return (
      <Popover
        open={open && !disabled}
        onOpenChange={(val) => !disabled && setOpen(val)}
      >
        <div className="flex flex-col gap-1">
          {label && <label className="text-sm font-medium">{label}</label>}
          {renderTrigger(normalizedValue, false, (val) => onChange?.(val))}
          {renderOptions(normalizedValue, (val) => onChange?.(val))}
        </div>
      </Popover>
    );
  }

  return (
    <FormField
      control={control}
      name={name as Path<T>}
      rules={rules as any}
      render={({ field, fieldState }) => {
        const normalizedValue = normalizeValue(field.value);

        return (
          <FormItem className={wrapperClassName}>
            {label && (
              <FormLabel>
                {label}
                {required && <span className="text-red-500 ml-0.5">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <Popover
                open={open && !disabled}
                onOpenChange={(val) => !disabled && setOpen(val)}
              >
                {renderTrigger(
                  normalizedValue,
                  !!fieldState.error,
                  field.onChange,
                )}
                {renderOptions(normalizedValue, field.onChange)}
              </Popover>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
