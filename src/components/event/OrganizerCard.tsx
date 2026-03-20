/**
 * OrganizerCard.jsx
 * ============================================================
 * Displays event organizer info with avatar, name, and contact button.
 * Matches mockup (Image 9) sidebar "Organizer Info" section.
 * ============================================================
 */

interface OrganizerCardProps {
  organizer?: {
    name?: string;
    organization_name?: string;
    avatar_url?: string;
  };
  onContact?: () => void;
  variant?: "card" | "plain";
}

export default function OrganizerCard({
  organizer,
  onContact,
  variant = "card",
}: OrganizerCardProps) {
  const {
    name = "Event Organizer",
    organization_name,
    avatar_url,
  } = organizer || {};

  const displayName = organization_name || name;
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const content = (
    <>
      <h3 className="text-sm font-bold m-0">Organizer Info</h3>
      <div className="organizer-card">
        {avatar_url ? (
          <img
            className="organizer-card__avatar"
            src={avatar_url}
            alt={displayName}
          />
        ) : (
          <div className="organizer-card__avatar">{initials || "🌿"}</div>
        )}
        <div className="organizer-card__info">
          <div className="organizer-card__name">{displayName}</div>
        </div>
      </div>
      {onContact && (
        <button
          className="btn btn-secondary btn-block organizer-card__contact-btn"
          onClick={onContact}
        >
          Contact
        </button>
      )}
    </>
  );

  if (variant === "plain") {
    return <div className="organizer-card-wrapper flex flex-col gap-2">{content}</div>;
  }

  return <div className="event-detail__sidebar-card">{content}</div>;
}
