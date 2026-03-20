import React from "react";
import { useEventsList } from "../hooks/useEvents";
import ServiceDayCard from "../components/event/ServiceDayCard";
import GreenLoader from "../components/ui/custom/green-loader";
import CustomPagination from "../components/ui/custom/custom-pagination";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const ServiceDay: React.FC = () => {
  const {
    events: upcomingEvents,
    loading: upcomingLoading,
    pagination: upcomingPagination,
  } = useEventsList({
    status: "open",
    per_page: 6,
  });

  const {
    events: pastEvents,
    loading: pastLoading,
    pagination: pastPagination,
  } = useEventsList({
    status: "close",
    per_page: 6,
  });

  return (
    <div className="min-h-screen bg-gray-200">
      {/* <Header /> */}

      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-xl md:text-4xl font-bold text-foreground tracking-tight">
              Community Service Days
            </h1>
          </div>

          {/* Upcoming Service Days Section */}
          <Card className="shadow-soft border-none bg-white/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-4 mb-6">
              <CardTitle className="text-3xl font-bold text-foreground">
                Upcoming Service Days
              </CardTitle>
              <CardDescription>
                Upcoming events in community service days.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingLoading ? (
                <GreenLoader />
              ) : upcomingEvents.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event) => (
                      <ServiceDayCard key={event.id} event={event} />
                    ))}
                  </div>
                  <CustomPagination
                    meta={{
                      page: upcomingPagination.page,
                      per_page: upcomingPagination.perPage,
                      total: upcomingPagination.total,
                      total_pages: upcomingPagination.totalPages,
                    }}
                    onPageChange={(newPage) =>
                      upcomingPagination.setPage(newPage)
                    }
                    onPerPageChange={(newPerPage) => {
                      upcomingPagination.setPerPage(newPerPage);
                      upcomingPagination.setPage(1);
                    }}
                    showPerPageSelector
                  />
                </>
              ) : (
                <p className="text-center text-muted-foreground py-12 bg-muted/30 rounded-lg border border-dashed border-border">
                  No upcoming service days found at the moment.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Past Community Impact Section */}
          <Card className="shadow-soft border-none bg-white/50 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 pb-4 mb-6">
              <CardTitle className="text-3xl font-bold text-foreground">
                Past Community Impact
              </CardTitle>
              <CardDescription>
                Completed service events results.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pastLoading ? (
                <GreenLoader />
              ) : pastEvents.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event) => (
                      <ServiceDayCard
                        key={event.id}
                        event={event}
                        isPast={true}
                      />
                    ))}
                  </div>
                  <CustomPagination
                    meta={{
                      page: pastPagination.page,
                      per_page: pastPagination.perPage,
                      total: pastPagination.total,
                      total_pages: pastPagination.totalPages,
                    }}
                    onPageChange={(newPage) => pastPagination.setPage(newPage)}
                    onPerPageChange={(newPerPage) => {
                      pastPagination.setPerPage(newPerPage);
                      pastPagination.setPage(1);
                    }}
                    showPerPageSelector
                  />
                </>
              ) : (
                <p className="text-center text-muted-foreground py-12 bg-muted/30 rounded-lg border border-dashed border-border">
                  No past service days found.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer-like spacer */}
      {/* <footer className="py-12 border-t border-border/50 bg-white/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground text-sm font-medium">
          © {new Date().getFullYear()} Volunteer Connect. All rights reserved.
        </div>
      </footer> */}
    </div>
  );
};

export default ServiceDay;
