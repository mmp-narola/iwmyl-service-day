/**
 * EventDetailPage.tsx
 * ============================================================
 * Public event detail page: /events/[id]
 *
 * Layout (matches mockup Image 9):
 *   - Breadcrumb
 *   - Hero: image + title + host + date + location + map
 *   - Body: description | sidebar (capacity, services, organizer)
 *   - Gallery section (if completed event - Image 13)
 *
 * Props:
 *   eventId     - The event ID (from route params)
 *   isLoggedIn  - Auth state
 *   user        - Current user
 *   onNavigate  - Navigation handler
 * ============================================================
 */

import { useEventDetail, useEventImages } from "../../hooks/useEvents";
import EventCapacityBar from "./EventCapacityBar";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../ui/custom/CustomButton";
import {
  MapPin,
  Calendar,
  MoveLeft,
  Users,
  Wrench,
  Truck,
  Globe,
} from "lucide-react";
import group from "../../assets/group.png";
import { getTagList } from "../../helpers/utils";
import EventGallery from "./EventGallery";
import CustomTag from "../ui/custom/custom-badge";
import OrganizerCard from "./OrganizerCard";

export default function EventDetailPage() {
  const { eventId } = useParams();
  const { event, loading, error } = useEventDetail(eventId!);
  const { images: eventPhotos } = useEventImages(eventId!);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-muted-foreground">
        Loading event details...
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-red-500">
        {error || "Event not found."}
      </div>
    );
  }

  const {
    event_title,
    organization_name,
    event_date,
    time_block,
    meeting_city,
    meeting_state,
    meeting_zip,
    description,
    services_offered,
    homes_capacity = 0,
    remaining_capacity = 0,
    status,
    organizer,
    media = [],
    event_image,
    meeting_point,
    volunteers_count,
    bring_equipment,
    haul_debris,
    website_url,
  } = event;

  let services: string[] = [];

  if (typeof services_offered === "string") {
    try {
      services = JSON.parse(services_offered);
    } catch {
      services = [];
    }
  } else if (Array.isArray(services_offered)) {
    services = services_offered;
  }

  const homes_filled = homes_capacity - remaining_capacity;
  const isCompleted = status === "completed" || status === "archived";
  const isFull = homes_capacity > 0 && remaining_capacity === 0;

  const displayMedia =
    eventPhotos.length > 0
      ? eventPhotos.flatMap((img: any) => [
        {
          ...img,
          image_url: img.before_image_url,
          type: "before",
        },
        {
          ...img,
          image_url: img.after_image_url,
          type: "after",
        },
      ])
      : media;
  const hasPhotos = displayMedia && displayMedia.length > 0;

  const timeLabel =
    (
      {
        morning: "8am - 12pm",
        afternoon: "12pm - 4pm",
        full_day: "8am - 4pm",
      } as Record<string, string>
    )[time_block || ""] || time_block;

  const dateStr = event_date
    ? new Date(event_date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "";

  const eventDetails = [
    {
      show: true,
      icon: Users,
      text: `${volunteers_count || 0} Volunteers`,
    },
    {
      show: !!bring_equipment,
      icon: Wrench,
      text: "We bring our own equipment",
    },
    {
      show: !!haul_debris,
      icon: Truck,
      text: "We can haul debris",
    },
  ];

  return (
    <div className="event-detail">
      <div className="p-6">
        {/* Completed Banner */}
        {isCompleted && (
          <div className="bg-orange-100 text-orange-800 text-center p-2 text-sm rounded-sm mb-4">
            This event has concluded.
          </div>
        )}

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-start gap-6 pb-8 border-b border-border/50">
          {/* Hero Image */}
          <div className="w-full md:w-80 aspect-[4/3] overflow-hidden bg-muted flex-shrink-0 rounded-sm">
            <img
              src={event_image || group}
              alt={event_title}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = group;
              }}
            />
          </div>

          {/* Hero Info */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl md:text-3xl font-bold text-emerald-600 capitalize break-words">
                {event_title}
              </h1>
              <div className="flex gap-2 shrink-0">
                <CustomButton
                  variant="outline"
                  icon={<MoveLeft />}
                  size="sm"
                  onClick={() => navigate(-1)}
                  className="rounded-sm"
                >
                  Back
                </CustomButton>
              </div>
            </div>

            {organization_name && (
              <div className="text-lg font-medium text-muted-foreground capitalize mb-2">
                Hosted by {organization_name}
              </div>
            )}

            <div className="space-y-2">
              {website_url && (
                <a
                  href={
                    website_url.startsWith("http")
                      ? website_url
                      : `https://${website_url}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-primary hover:underline mb-2 w-fit"
                >
                  <Globe className="w-5 h-5" />
                  {website_url.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              )}

              <div className="flex items-center gap-2 text-foreground font-medium">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="uppercase text-foreground">
                  {dateStr} | {timeLabel}
                </span>
              </div>
              <div className="flex items-start gap-2 text-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="uppercase tracking-wider text-muted-foreground text-sm">
                  {[meeting_point, meeting_city, meeting_state, meeting_zip]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-10 mt-6">
          <div className="sm:col-span-8 min-w-0">
            <div className="pr-3">
              <div className="text-xl text-foreground font-bold mb-4">
                About this Event
              </div>

              <div
                className="prose prose-sm max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{
                  __html: description || "No description provided.",
                }}
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="sm:col-span-4 min-w-0">
            <div className="event-detail__sidebar-card p-0 overflow-hidden">
              <div className="space-y-4 p-4">
                {/* Section 1: Action/Capacity */}
                {!isCompleted && (
                  <div className="flex flex-col gap-4">
                    <CustomButton
                      className="btn btn-primary btn-block btn-lg"
                      disabled={isFull}
                      onClick={() => {
                        window.location.href = `https://iwanttomowyourlawn.com/login/?event_id=${event.id}`;
                      }}
                    >
                      {isFull ? "Event Full" : "Request Help"}
                    </CustomButton>

                    <EventCapacityBar
                      filled={homes_filled}
                      max={homes_capacity}
                      wrapperClassName="flex-col gap-2 items-stretch"
                      labelClassName="mb-0"
                    />
                  </div>
                )}

                {!isCompleted && <hr className="border-border/50" />}

                {/* Section: Logistics */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-sm font-bold">Logistics</h3>
                  <div className="space-y-2">
                    {eventDetails
                      .filter((item) => item.show)
                      .map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-sm text-muted-foreground"
                          >
                            <Icon className="w-5 h-5 text-foreground" />
                            <span className="tracking-wider">{item.text}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Section 2: Services */}
                <div className="flex flex-col gap-2">
                  <h3 className="text-sm font-bold">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {getTagList(services).map(
                      (service: string, index: number) => (
                        <CustomTag
                          key={index}
                          tag_text={service}
                          className="w-fit"
                        />
                      ),
                    )}
                  </div>
                </div>

                <hr className="border-border/50" />

                {/* Section 3: Organizer */}

                <OrganizerCard
                  organizer={organizer || { organization_name }}
                  variant="plain"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Tab Components Tier - Always below the Grid */}
        {hasPhotos && (
          <div className="event-detail__body pt-6 border-t border-border/50 mt-6">
            <div className="event-detail__main">
              <div className="bg-secondary/80 rounded-sm p-4 sm:p-6 lg:p-6">
                <EventGallery
                  media={displayMedia}
                  canUpload={false}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
