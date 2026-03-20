/**
 * EventGallery.jsx
 * ============================================================
 * Displays before/after impact photos in a grid.
 * Matches mockup (Image 13) — paired before/after layout.
 *
 * Props:
 *   media       - Array of { id, image_url, type ('before'|'after'), volunteer_name }
 *   eventTitle  - For accessibility / heading
 *   onUpload    - Handler to trigger upload modal (if organizer/volunteer)
 *   canUpload   - Boolean: show upload button
 * ============================================================
 */

import CustomButton from "@/components/ui/custom/CustomButton";

export default function EventGallery({
  media = [],
  onUpload,
  canUpload = false,
}: {
  media?: any[];
  onUpload?: () => void;
  canUpload?: boolean;
}) {
  // Pair before/after by grouping adjacent items
  const pairs = [];
  const beforePhotos = media.filter((m) => m.type === "before");
  const afterPhotos = media.filter((m) => m.type === "after");
  const generalPhotos = media.filter(
    (m) => m.type !== "before" && m.type !== "after",
  );

  const maxPairs = Math.max(beforePhotos.length, afterPhotos.length);

  for (let i = 0; i < maxPairs; i++) {
    pairs.push({
      before: beforePhotos[i] || null,
      after: afterPhotos[i] || null,
    });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <h2 className="font-bold text-lg">Service Gallery</h2>
        {canUpload && onUpload && (
          <CustomButton size="sm" onClick={onUpload}>
            📷 Upload Impact Photos
          </CustomButton>
        )}
      </div>

      {media.length === 0 ? (
        <p style={{ color: "#6c757d", textAlign: "center", padding: "24px 0" }}>
          No photos uploaded yet.{" "}
          {canUpload ? "Be the first to share your impact!" : ""}
        </p>
      ) : (
        <>
          {/* Before / After Pairs */}
          {pairs.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pairs.map((pair, idx) => (
                <div key={idx} className="flex gap-4 justify-center">
                  <div className="impact-gallery-pair w-full max-w-[140px]">
                    {pair.before && pair.before.image_url ? (
                      <>
                        <img src={pair.before.image_url} alt="Before" />
                        <span className="label">Before</span>
                      </>
                    ) : (
                      <div
                        style={{
                          aspectRatio: "1/1",
                          background: "white",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#adb5bd",
                          fontSize: "0.8rem",
                        }}
                        className="w-full"
                      >
                        No before photo
                      </div>
                    )}
                  </div>
                  <div className="impact-gallery-pair w-full max-w-[140px]">
                    {pair.after && pair.after.image_url ? (
                      <>
                        <img src={pair.after.image_url} alt="After" />
                        <span className="label">After</span>
                      </>
                    ) : (
                      <div
                        style={{
                          aspectRatio: "1/1",
                          background: "white",
                          borderRadius: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#adb5bd",
                          fontSize: "0.8rem",
                        }}
                        className="w-full"
                      >
                        No after photo
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* General Photos */}
          {generalPhotos.length > 0 && (
            <div className="impact-gallery-grid" style={{ marginTop: 16 }}>
              {generalPhotos.map((photo) => (
                <div key={photo.id} className="impact-gallery-pair">
                  <img src={photo.image_url} alt="Event photo" />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
