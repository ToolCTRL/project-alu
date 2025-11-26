import CheckIcon from "../icons/CheckIcon";
import { StepDto } from "./StepDto";

export default function ProgressBar({ steps }: Readonly<{ readonly steps: StepDto[] }>) {
  return (
    <nav aria-label="Progress">
      <ol className="border-border bg-background divide-gray-300 rounded-t-md border sm:divide-y lg:flex lg:divide-y-0">
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === "completed" ? (
              <div className="group hidden w-full items-center sm:flex">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="bg-theme-600 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="text-foreground ml-3 truncate text-sm font-medium">{step.title}</span>
                </span>
              </div>
            ) : step.status === "current" ? (
              <div className="flex items-center px-6 py-4 text-sm font-medium" aria-current="step">
                <span className="border-theme-600 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2">
                  <span className="text-theme-600">{stepIdx + 1}</span>
                </span>
                <span className="text-theme-600 ml-3 truncate text-sm font-medium">{step.title}</span>
              </div>
            ) : (
              <div className="group hidden items-center  sm:flex">
                <span className="flex items-center px-6 py-4 text-sm font-medium">
                  <span className="border-border flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2">
                    <span className="text-muted-foreground">{stepIdx + 1}</span>
                  </span>
                  <span className="text-muted-foreground ml-3 truncate text-sm font-medium">{step.title}</span>
                </span>
              </div>
            )}

            {stepIdx === steps.length - 1 ? null : (
              <div className="absolute right-0 top-0 hidden h-full w-5 lg:block" aria-hidden="true">
                <svg className="h-full w-full text-gray-300" viewBox="0 0 22 80" fill="none" preserveAspectRatio="none">
                  <path d="M0 -2L20 40L0 82" vectorEffect="non-scaling-stroke" stroke="currentcolor" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
