import React from "react";
import { Clock } from "lucide-react";
import group from "@/assets/group.png";
import CustomButton from "@/components/ui/custom/CustomButton";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export interface EventData {
  id: string | number;
  event_title: string;
  event_date: string;
  time_block: string;
  event_image?: string;
  status?: string;
}

interface ServiceDayCardProps {
  event: EventData;
  isPast?: boolean;
}

const ServiceDayCard: React.FC<ServiceDayCardProps> = ({ event, isPast }) => {
  const { event_title, event_date, time_block, event_image } = event;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/service-day/${event.id}`);
  };

  const dateStr = new Date(event_date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const timeLabel =
    {
      morning: "10am - 12pm",
      afternoon: "12pm - 4pm",
      full_day: "8am - 4pm",
    }[time_block || ""] || "10am - 3pm";

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        "bg-white rounded-xl border border-border shadow-soft overflow-hidden transition-all duration-300 hover:shadow-medium group cursor-pointer",
        isPast && "grayscale opacity-90",
      )}
    >
      <div className="aspect-video relative overflow-hidden bg-muted">
        <img
          src={event_image || group}
          alt={event_title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isPast && (
          <div className="absolute top-3 left-3">
            <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
              Completed
            </div>
          </div>
        )}
      </div>
      <div className="p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-foreground text-lg line-clamp-1 transition-colors group-hover:text-primary">
            {event_title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {timeLabel}
            </span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{dateStr}</span>
          </div>
        </div>

        <div className="flex gap-2">
          {isPast ? (
            <CustomButton
              variant="outline"
              className="w-full h-11 border-border font-bold shadow-none hover:bg-muted"
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              View Results
            </CustomButton>
          ) : (
            <CustomButton
              className="w-full h-11 bg-primary hover:bg-primary/90 font-bold shadow-sm"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `https://iwanttomowyourlawn.com/login/?event_id=${event.id}`;
              }}
            >
              Request Help
            </CustomButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDayCard;
