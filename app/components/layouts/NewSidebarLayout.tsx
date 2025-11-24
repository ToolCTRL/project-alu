import { Fragment, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router";
import OnboardingSession from "~/modules/onboarding/components/OnboardingSession";
import { useKBar } from "kbar";
import NewSidebarMenu from "./NewSidebarMenu";

interface Props {
  layout: "app" | "admin" | "docs";
  children: ReactNode;
  className?: string;
}

export default function NewSidebarLayout({ layout, children }: Props) {
  const { query } = useKBar();
  const params = useParams();
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  useEffect(() => {
    try {
      // @ts-ignore
      $crisp?.push(["do", "chat:hide"]);
    } catch (e) {
      // ignore
    }
  }, []);

  function onOpenCommandPalette() {
    query.toggle();
  }

  return (
    <Fragment>
      <OnboardingSession open={onboardingModalOpen} setOpen={setOnboardingModalOpen} />
      <NewSidebarMenu key={params.tenant} layout={layout} onOpenCommandPalette={onOpenCommandPalette}>
        {children}
      </NewSidebarMenu>
    </Fragment>
  );
}
