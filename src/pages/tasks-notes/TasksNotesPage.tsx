import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardService } from "@/api/dashboard/dashboard.service";
import { useFestivals } from "@/api/festival/useFestivals";
import { useFestivalApiStore } from "@/api/festival/festival.store";
import { AppSelect } from "@/components/common/AppSelect";
import { DashboardTasks } from "@/pages/dashboard/components/DashboardTasks";
import { DashboardNotes } from "@/pages/dashboard/components/DashboardNotes";
import { CheckSquare, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getModuleTheme } from "@/theme/colors";

type ActiveTab = "tasks" | "notes";

export function TasksNotesPage() {
  const theme = getModuleTheme("tasks-notes");
  const [activeTab, setActiveTab] = useState<ActiveTab>("tasks");

  const { activeFestivalId, setActiveFestivalId } = useFestivalApiStore();
  const { data: festivalsData, isLoading: festivalsLoading } = useFestivals();
  const festivals = (festivalsData?.festivals ?? []).filter((f) => !f.isDeleted);

  const currentFestivalId =
    activeFestivalId && festivals.some((f) => f._id === activeFestivalId)
      ? activeFestivalId
      : festivals[0]?._id || "";

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard", currentFestivalId],
    queryFn: () => DashboardService.getDashboard(currentFestivalId).then((r) => r.data),
    enabled: !!currentFestivalId,
    staleTime: 60 * 1000,
  });

  const { data: tasksData } = useQuery({
    queryKey: ["dashboard", "tasks", currentFestivalId],
    queryFn: () => DashboardService.getTasks(currentFestivalId).then((r) => r.data),
    enabled: !!currentFestivalId && currentFestivalId !== "ALL",
  });

  const { data: notesData } = useQuery({
    queryKey: ["dashboard", "notes", currentFestivalId],
    queryFn: () => DashboardService.getNotes(currentFestivalId).then((r) => r.data),
    enabled: !!currentFestivalId && currentFestivalId !== "ALL",
  });

  const festivalOptions = festivals.map((f) => ({
    value: f._id,
    label: `${f.name} (${f.year})`,
  }));

  const taskCount = useMemo(() => {
    const raw =
      typeof tasksData === "object" && tasksData && "tasks" in tasksData
        ? (tasksData as { tasks: unknown[] }).tasks
        : Array.isArray(tasksData)
          ? tasksData
          : [];
    return Array.isArray(raw) ? raw.length : 0;
  }, [tasksData]);

  const noteCount = useMemo(() => {
    const raw =
      typeof notesData === "object" && notesData && "notes" in notesData
        ? (notesData as { notes: unknown[] }).notes
        : Array.isArray(notesData)
          ? notesData
          : [];
    return Array.isArray(raw) ? raw.length : 0;
  }, [notesData]);

  const tabs: { id: ActiveTab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "tasks", label: "To-dos", icon: CheckSquare, count: taskCount },
    { id: "notes", label: "Notes", icon: FileText, count: noteCount },
  ];

  return (
    <div className="space-y-3 sm:space-y-5 p-3 sm:p-6 max-w-7xl mx-auto overflow-x-hidden pb-24 sm:pb-8">
      {/* Mobile-first Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card p-3.5 sm:p-5 rounded-2xl border border-border/60 shadow-2xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <span className={cn("h-9 w-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm font-bold", theme.gradient)}>
              <CheckCircle2 className="h-5 w-5 text-white" />
            </span>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-foreground">
              Tasks & Notes
            </h1>
          </div>
          <p className="text-xs text-muted-foreground hidden sm:block pl-11">
            Organize festival operational tasks, team to-dos, and notes in one place.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <AppSelect
            value={currentFestivalId}
            onChange={(val) => setActiveFestivalId(val)}
            options={festivalOptions}
            placeholder={festivalsLoading ? "Loading festivals..." : "Select festival..."}
          />
        </div>
      </div>

      {/* Segmented Control Bar */}
      <div className="flex items-center p-1 bg-muted/60 rounded-2xl border border-border/60 max-w-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex-1",
                isActive
                  ? cn(theme.gradient, "text-white shadow-2xs font-bold")
                  : "text-muted-foreground hover:text-foreground hover:bg-card/40",
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-white" : "")} />
              <span>{tab.label}</span>
              {typeof tab.count === "number" && (
                <span
                  className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-semibold",
                    isActive
                      ? "bg-white/20 text-white font-bold"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Embedded Module Content (No extra outer card wrapper) */}
      <div className="bg-card p-3.5 sm:p-5 rounded-2xl border border-border/60 shadow-2xs min-h-[400px]">
        {activeTab === "tasks" && <DashboardTasks data={dashboardData} embedded={true} />}
        {activeTab === "notes" && <DashboardNotes data={dashboardData} embedded={true} />}
      </div>
    </div>
  );
}

export default TasksNotesPage;

