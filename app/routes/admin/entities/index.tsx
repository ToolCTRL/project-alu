import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActionFunction, LoaderFunctionArgs, MetaFunction, useLoaderData, Link } from "react-router";
import EntitiesTable from "~/components/entities/EntitiesTable";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import InputSearch from "~/components/ui/input/InputSearch";
import { getTranslations } from "~/locale/i18next.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { EntityWithCount, getAllEntitiesWithRowCount, updateEntity } from "~/utils/db/entities/entities.db.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import DateUtils from "~/utils/shared/DateUtils";
import { EntityRelationshipWithDetails, getAllEntityRelationships } from "~/utils/db/entities/entityRelationships.db.server";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import DownloadIcon from "~/components/ui/icons/DownloadIcon";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import EntityHelper from "~/utils/helpers/EntityHelper";
import { motion } from "framer-motion";
import { Filter, Sparkles, Layers, Eye, FlaskConical, BookOpen, Code, Sparkles as SparklesIcon, Hammer, Boxes, KeyRound } from "lucide-react";
import { Badge } from "~/components/ui/badge";

type LoaderData = {
  title: string;
  items: EntityWithCount[];
  relationships: EntityRelationshipWithDetails[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdOrNull({ request, params });
  const items = await getAllEntitiesWithRowCount({ tenantId });
  const relationships = await getAllEntityRelationships();

  const data: LoaderData = {
    title: `${t("models.entity.plural")} | ${process.env.APP_NAME}`,
    items,
    relationships,
  };
  return data;
};

export const action: ActionFunction = async ({ request, params }) => {
  const tenantId = await getTenantIdOrNull({ request, params });
  await verifyUserHasPermission(request, "admin.entities.update", tenantId);
  if (tenantId) {
    return Response.json({ error: "Tenant-scoped admins cannot reorder global entities" }, { status: 403 });
  }
  const { t } = await getTranslations(request);

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  if (action === "set-orders") {
    const items: { id: string; order: number }[] = form.getAll("orders[]").map((entry: FormDataEntryValue) => {
      if (typeof entry !== "string") {
        throw new TypeError("Invalid orders[] payload");
      }
      return JSON.parse(entry);
    });

    await Promise.all(
      items.map(async ({ id, order }) => {
        await updateEntity(id, { order: Number(order) });
      })
    );
    return Response.json({ updated: true });
  }
  return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function EntitiesIndexRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();

  const [selected, setSelected] = useState<EntityWithCount[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const totalRows = data.items.reduce((sum, item) => sum + (item._count?.rows ?? 0), 0);
  const totalProps = data.items.reduce((sum, item) => sum + (item.properties?.length ?? 0), 0);
  const navLinks = [
    { title: "Groups", desc: "Kategorien & Sets", href: "groups", icon: <Boxes className="h-4 w-4" /> },
    { title: "Formulas", desc: "Berechnungen", href: "formulas", icon: <FlaskConical className="h-4 w-4" /> },
    { title: "Rows", desc: "Daten & Records", href: "rows", icon: <Layers className="h-4 w-4" /> },
    { title: "Views", desc: "Perspektiven", href: "views", icon: <Eye className="h-4 w-4" /> },
    { title: "Logs", desc: "Aktivität", href: "logs", icon: <BookOpen className="h-4 w-4" /> },
    { title: "No-code", desc: "Builder", href: "no-code", icon: <Hammer className="h-4 w-4" /> },
    { title: "Yes-code", desc: "Code-Generator", href: "yes-code", icon: <Code className="h-4 w-4" /> },
    { title: "API", desc: "Schema & Keys", href: "api", icon: <KeyRound className="h-4 w-4" /> },
    { title: "Fake Rows", desc: "Testdaten", href: "fake-rows", icon: <SparklesIcon className="h-4 w-4" /> },
    { title: "Templates", desc: "Vorlagen", href: "templates", icon: <Sparkles className="h-4 w-4" /> },
  ];

  const filteredItems = () => {
    if (!data.items) {
      return [];
    }
    return data.items.filter(
      (f) =>
        DateUtils.dateYMDHMS(f.createdAt)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.slug?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.title?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.titlePlural?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        t(f.title)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        t(f.titlePlural)?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.properties.find(
          (x) =>
            x.name?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
            x.title?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
            t(x.title)?.toString().toUpperCase().includes(searchInput.toUpperCase())
        )
    );
  };

  function exportEntities() {
    let items = selected.length > 0 ? selected : filteredItems();
    const templateEntities = EntityHelper.exportEntitiesToTemplate(items, data.relationships);
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(templateEntities, null, "\t"));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "entities.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  return (
    <main className="relative z-0 flex-1 overflow-hidden pb-10 text-white">
      <div className="relative mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="section-shell relative overflow-hidden rounded-[var(--radius-xl,1.75rem)] border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/0 px-6 py-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.35em] text-white/70">
                <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-cyan-100">Steuerzentrale</span>
                <span className="rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-emerald-100">{t("models.entity.plural")}</span>
              </div>
              <div>
                <h1 className="text-3xl font-semibold leading-tight tracking-tight">{t("models.entity.plural")}</h1>
                <p className="text-base text-white/75">{t("settings.admin.subtitle") ?? "Struktur, Schema und Beziehungen verwalten."}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm text-white/70">
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  <Sparkles className="mr-2 h-4 w-4 text-amber-300" />
                  {data.items.length} {t("models.entity.plural")}
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {totalProps} Props
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/5 text-white/80">
                  {totalRows} Rows
                </Badge>
              </div>
            </div>

            <div className="relative ml-auto hidden h-72 w-72 shrink-0 items-center justify-center overflow-visible lg:flex">
              <div className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_center,rgba(147,197,253,0.32),rgba(79,93,141,0.08)_55%,transparent_75%)] blur-3xl opacity-80" />
              <motion.div
                className="absolute right-[-3rem] top-[-2rem] h-[18rem] w-[18rem] text-white/80 drop-shadow-[0_14px_40px_rgba(0,0,0,0.55)]"
                aria-hidden
                animate={{ rotateY: 360 }}
                transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
              >
                <RubiksCube />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-white/70">
                <Filter className="h-4 w-4" />
                <span className="text-sm uppercase tracking-[0.28em]">Filter &amp; Aktionen</span>
              </div>
            <div className="flex items-center space-x-2">
              <InputSearch className="hidden md:block w-56" value={searchInput} setValue={setSearchInput} placeholder={t("shared.search") ?? "Search"} />
              <ButtonSecondary disabled={data.items.length === 0} onClick={exportEntities} className="text-muted-foreground">
                <DownloadIcon className="h-5 w-5" />
              </ButtonSecondary>
              <ButtonPrimary disabled={!getUserHasPermission(adminData, "admin.entities.create")} to="/admin/entities/new">
                <span>{t("shared.new")}</span>
              </ButtonPrimary>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <EntitiesTable items={filteredItems()} selected={selected} onSelected={(e) => setSelected(e)} />
          </div>
        </section>

        <section className="rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-card/80 p-5 shadow-[var(--shadow-soft,0px_24px_60px_rgba(5,9,20,0.45))]">
          <div className="mb-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.28em] text-white/60">Navigation</p>
              <p className="text-white/85 text-sm">Schnelle Sprünge in alle Entity-Bereiche.</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                relative="path"
                className="group relative overflow-hidden rounded-[var(--radius-lg,1.25rem)] border border-white/10 bg-white/5 p-4 text-white shadow-[0_20px_40px_rgba(7,12,20,0.35)] transition hover:border-white/25 hover:bg-white/10"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-white/10 p-2 text-white">{item.icon}</span>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold">{item.title}</p>
                    <p className="text-xs text-white/70">{item.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function RubiksCube() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="cubeFace1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5b9ff" />
          <stop offset="100%" stopColor="#6b8cff" />
        </linearGradient>
        <linearGradient id="cubeFace2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b8ffe5" />
          <stop offset="100%" stopColor="#4fd1c5" />
        </linearGradient>
        <linearGradient id="cubeFace3" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffe0b3" />
          <stop offset="100%" stopColor="#f6ad55" />
        </linearGradient>
      </defs>
      <g transform="translate(25 30) scale(0.8)">
        <polygon points="75,10 165,45 90,80 5,45" fill="url(#cubeFace1)" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <polygon points="5,45 90,80 90,170 5,135" fill="url(#cubeFace2)" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <polygon points="165,45 90,80 90,170 165,135" fill="url(#cubeFace3)" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        {/* Grid lines to hint at cubelets */}
        <g stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none">
          <line x1="35" y1="27" x2="125" y2="62" />
          <line x1="65" y1="16" x2="155" y2="51" />
          <line x1="32" y1="58" x2="117" y2="93" />
          <line x1="62" y1="70" x2="147" y2="105" />
          <line x1="90" y1="80" x2="90" y2="170" />
          <line x1="36" y1="48" x2="36" y2="138" />
          <line x1="144" y1="48" x2="144" y2="138" />
        </g>
      </g>
    </svg>
  );
}
