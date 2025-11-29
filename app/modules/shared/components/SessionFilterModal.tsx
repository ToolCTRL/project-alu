import { Tenant } from "@prisma/client";
import { Form } from "react-router";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import InputDate from "~/components/ui/input/InputDate";
import InputSelector from "~/components/ui/input/InputSelector";
import InputText from "~/components/ui/input/InputText";
import Modal from "~/components/ui/modals/Modal";
import { i18nConfig } from "~/locale/i18n";
import { UserWithNames } from "~/utils/db/users.db.server";

export default function SessionFilterModal({
  filters,
  item,
  idx,
  open,
  onClose,
  onSave,
  metadata,
  onRemove,
}: Readonly<{
  filters: string[];
  item?: { type: string; value: string | null };
  idx: number | undefined;
  open: boolean;
  onClose: () => void;
  onSave: (item: { type: string; value: string | null }) => void;
  onRemove?: (idx: number) => void;
  metadata: {
    users: UserWithNames[];
    tenants: Tenant[];
    subscriptionProducts: SubscriptionProductDto[];
    roles: { id: string; name: string }[];
    analytics?: {
      via: { name: string; count: number }[];
      httpReferrer: { name: string; count: number }[];
      browser: { name: string; count: number }[];
      os: { name: string; count: number }[];
      source: { name: string; count: number }[];
      medium: { name: string; count: number }[];
      campaign: { name: string; count: number }[];
    };
  };
}>) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<{ type: string; value: string | null }>();

  useEffect(() => {
    setFilter(item);
  }, [item]);

  function onConfirm() {
    if (!filter?.type) {
      return;
    }
    onSave(filter);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onConfirm();
  }

  function renderValueInput() {
    if (filter?.type === "tenant.is") {
      return (
        <InputSelector
          name="value"
          title={t("shared.value")}
          disabled={!filter?.type}
          value={filter?.value ?? undefined}
          withSearch={true}
          setValue={(e) => setFilter({ ...filter, value: e?.toString() ?? null })}
          options={metadata.tenants.map((t) => {
            return { value: t.id, name: t.name };
          })}
          required
        />
      );
    }
    if (filter?.type === "user.is") {
      return (
        <InputSelector
          name="value"
          title={t("shared.value")}
          disabled={!filter?.type}
          value={filter?.value ?? undefined}
          withSearch={true}
          setValue={(e) => setFilter({ ...filter, value: e?.toString() ?? null })}
          options={metadata.users.map((t) => {
            return { value: t.email, name: t.email };
          })}
          required
        />
      );
    }
    if (["user.roles.contains", "user.roles.notContains"].includes(filter?.type ?? "")) {
      return (
        <InputSelector
          name="value"
          title={t("shared.value")}
          disabled={!filter?.type}
          value={filter?.value ?? undefined}
          withSearch={true}
          setValue={(e) => setFilter({ type: filter?.type ?? "", value: e?.toString() ?? null })}
          options={metadata.roles.map((t) => {
            return { value: t.name, name: t.name };
          })}
          required
        />
      );
    }
    if (filter?.type === "tenant.subscription.products.has") {
      return (
        <InputSelector
          name="value"
          title={t("onboarding.filter.value")}
          value={filter.value ?? undefined}
          withSearch={true}
          setValue={(e) => setFilter({ ...filter, value: e?.toString() ?? null })}
          options={metadata.subscriptionProducts.map((f) => {
            return { value: f.id, name: t(f.title) };
          })}
          required
        />
      );
    }
    if (filter?.type === "env") {
      return (
        <FilterSelector
          filter={filter}
          setFilter={setFilter}
          options={[
            { value: "production", name: "Production" },
            { value: "development", name: "Development" },
            { value: "staging", name: "Staging" },
          ]}
        />
      );
    }
    if (filter?.type === "percentage") {
      return (
        <FilterSelector
          filter={filter}
          setFilter={setFilter}
          options={Array.from({ length: 10 }, (_, i) => i + 1).map((f) => {
            return {
              value: `${f * 10}`,
              name: `${f * 10}%`,
            };
          })}
        />
      );
    }
    if (["session.darkMode", "session.logged", "tenant.subscription.active", "tenant.api.used"].includes(filter?.type ?? "")) {
      return (
        <FilterSelector
          filter={filter}
          setFilter={setFilter}
          options={[
            { value: "true", name: "True" },
            { value: "false", name: "False" },
          ]}
        />
      );
    }
    if (["user.language", "session.language"].includes(filter?.type ?? "")) {
      return (
        <FilterSelector
          filter={filter}
          setFilter={setFilter}
          options={i18nConfig.supportedLngs.map((f) => {
            return {
              value: f,
              name: f,
            };
          })}
        />
      );
    }
    if (metadata.analytics && filter?.type.startsWith("analytics.")) {
      return <AnalyticsSelector filter={filter} setFilter={setFilter} analytics={metadata.analytics} />;
    }
    if (filter?.type === "page") {
      return (
        <FilterSelector
          filter={filter}
          setFilter={setFilter}
          options={[
            { name: "Landing", value: "/" },
            { name: "Pricing", value: "/pricing" },
            { name: "Contact", value: "/contact" },
            { name: "Newsletter", value: "/newsletter" },
            { name: "Login", value: "/login" },
            { name: "Register", value: "/register" },
            { name: "Forgot password", value: "/forgot-password" },
            { name: "Reset password", value: "/reset" },
            { name: "Docs", value: "/docs" },
          ]}
        />
      );
    }
    if (["user.createdAfter", "user.createdBefore"].includes(filter?.type ?? "")) {
      return (
        <InputDate
          name="value"
          title={t("shared.value")}
          disabled={!filter?.type}
          value={filter?.value ? new Date(filter?.value) : undefined}
          onChange={(e) => setFilter({ type: filter?.type ?? "", value: e?.toString() ?? null })}
          required
        />
      );
    }
    return (
      <InputText
        name="value"
        title={t("shared.value")}
        disabled={!filter?.type}
        value={filter?.value ?? undefined}
        setValue={(e) => setFilter({ type: filter?.type ?? "", value: e.toString() ?? null })}
        required
      />
    );
  }
  return (
    <Modal open={open} setOpen={onClose} size="md">
      <Form onSubmit={onSubmit} className="inline-block w-full p-1 text-left align-bottom sm:align-middle">
        <input name="action" type="hidden" value="create" readOnly hidden />
        <div className="mt-3 text-center">
          <h3 className="text-foreground text-lg font-medium leading-6">{idx === undefined ? "Add filter" : "Edit filter"}</h3>
        </div>
        <div className="mt-4 space-y-2">
          <InputSelector
            name="type"
            title={t("shared.type")}
            value={filter?.type}
            withSearch={true}
            setValue={(e) => setFilter({ type: e?.toString() ?? "", value: null })}
            options={filters.map((f) => {
              return { value: f, name: f };
            })}
            required
          />
          {renderValueInput()}
        </div>
        <div className="mt-3 flex justify-between space-x-2">
          <div>
            {onRemove && idx !== undefined && (
              <ButtonSecondary
                type="button"
                destructive
                onClick={() => {
                  onRemove(idx);
                  onClose();
                }}
              >
                {t("shared.remove")}
              </ButtonSecondary>
            )}
          </div>
          <ButtonPrimary type="submit">{t("shared.save")}</ButtonPrimary>
        </div>
      </Form>
    </Modal>
  );
}

function FilterSelector({
  filter,
  setFilter,
  options,
}: Readonly<{
  filter: { type: string; value: string | null } | undefined;
  setFilter: Dispatch<SetStateAction<{ type: string; value: string | null } | undefined>>;
  options: { name: string; value: string }[];
}>) {
  const { t } = useTranslation();
  return (
    <Fragment>
      {["analytics.countryCode", "analytics.regionCode", "analytics.city", "analytics.zipCode"].includes(filter?.type ?? "") ? (
        <InputText
          name="value"
          title={t("shared.value")}
          disabled={!filter?.type}
          value={filter?.value ?? undefined}
          setValue={(e) => setFilter({ type: filter?.type ?? "", value: e.toString() ?? null })}
          required
        />
      ) : (
        <InputSelector
          name="value"
          title={t("shared.value")}
          disabled={!filter?.type}
          value={filter?.value ?? undefined}
          withSearch={true}
          setValue={(e) => setFilter({ type: filter?.type ?? "", value: e?.toString() ?? null })}
          options={options}
          required
        />
      )}
    </Fragment>
  );
}

function AnalyticsSelector({
  filter,
  setFilter,
  analytics,
}: Readonly<{
  filter: { type: string; value: string | null } | undefined;
  setFilter: Dispatch<SetStateAction<{ type: string; value: string | null } | undefined>>;
  analytics: {
    via: { name: string; count: number }[];
    httpReferrer: { name: string; count: number }[];
    browser: { name: string; count: number }[];
    os: { name: string; count: number }[];
    source: { name: string; count: number }[];
    medium: { name: string; count: number }[];
    campaign: { name: string; count: number }[];
  };
}>) {
  const [options, setOptions] = useState<{ name: string; count: number }[]>([]);

  useEffect(() => {
    let options: { name: string; count: number }[] = [];
    if (filter?.type === "analytics.via") {
      options = analytics.via;
    } else if (filter?.type === "analytics.httpReferrer") {
      options = analytics.httpReferrer;
    } else if (filter?.type === "analytics.browser") {
      options = analytics.browser;
    } else if (filter?.type === "analytics.os") {
      options = analytics.os;
    } else if (filter?.type === "analytics.source") {
      options = analytics.source;
    } else if (filter?.type === "analytics.medium") {
      options = analytics.medium;
    } else if (filter?.type === "analytics.campaign") {
      options = analytics.campaign;
    }
    setOptions(options);
  }, [filter, analytics]);

  return (
    <FilterSelector
      filter={filter}
      setFilter={setFilter}
      options={options.map((f) => {
        return {
          value: f.name || "null",
          name: `${f.name || "null"} (${f.count})`,
        };
      })}
    />
  );
}
