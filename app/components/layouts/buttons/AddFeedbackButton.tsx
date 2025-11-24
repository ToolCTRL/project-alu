import { Fragment, useState } from "react";
import StarsIconFilled from "~/components/ui/icons/StarsIconFilled";
import SaasRockProFeature from "~/components/ui/misc/SaasRockProFeature";
import Modal from "~/components/ui/modals/Modal";

export default function AddFeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Fragment>
      <div className="relative hidden sm:inline-flex">
        <div className="relative">
          <div className="inline-flex divide-x divide-gray-300 rounded-sm shadow-none">
            <div className="relative z-0 inline-flex rounded-full text-sm shadow-none">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-muted-foreground bg-secondary hover:bg-secondary/90 border-border relative inline-flex items-center rounded-full border p-2 font-medium shadow-inner focus:z-10 focus:outline-hidden focus:ring-2 focus:ring-offset-2"
                aria-haspopup="listbox"
                aria-expanded="true"
                aria-labelledby="chat-label"
              >
                <span className="sr-only">Feedback</span>

                <StarsIconFilled className="h-5 w-5 p-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <Modal open={isOpen} setOpen={setIsOpen} size="sm">
        <SaasRockProFeature />
      </Modal>
    </Fragment>
  );
}
