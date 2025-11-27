import { InfiniteSlider } from "~/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "~/components/motion-primitives/progressive-blur";
import { LogoCloudDto } from "~/modules/pageBlocks/components/blocks/marketing/logoClouds/LogoCloudsBlockUtils";
import { cn } from "~/lib/utils";
import StripeIcon from "~/components/ui/icons/StripeIcon";

export default function LogoCloudsVariantScroll({ items }: { readonly items: LogoCloudDto[] }) {
  return (
    <section className="overflow-hidden">
      <div className="group relative m-auto max-w-7xl px-6">
        <div className="flex flex-col items-center md:flex-row">
          <div className="relative w-full py-6">
            <InfiniteSlider speedOnHover={20} speed={40} gap={150}>
              <div className="flex items-center">
                <svg
                  className={cn("mx-auto h-12 w-fit text-[#38BDF9] dark:text-[#38BDF9]")}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlSpace="preserve"
                  width="800"
                  height="800"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 6.036c-2.667 0-4.333 1.325-5 3.976 1-1.325 2.167-1.822 3.5-1.491.761.189 1.305.738 1.906 1.345C13.387 10.855 14.522 12 17 12c2.667 0 4.333-1.325 5-3.976-1 1.325-2.166 1.822-3.5 1.491-.761-.189-1.305-.738-1.907-1.345-.98-.99-2.114-2.134-4.593-2.134zM7 12c-2.667 0-4.333 1.325-5 3.976 1-1.326 2.167-1.822 3.5-1.491.761.189 1.305.738 1.907 1.345.98.989 2.115 2.134 4.594 2.134 2.667 0 4.333-1.325 5-3.976-1 1.325-2.167 1.822-3.5 1.491-.761-.189-1.305-.738-1.906-1.345C10.613 13.145 9.478 12 7 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              <div className="flex items-center">
                <svg className="mx-auto h-8 w-fit" xmlns="http://www.w3.org/2000/svg" width="602" height="360" fill="none" viewBox="0 0 602 360">
                  <path
                    fill="#F44250"
                    d="M481.36 180c0 16.572-6.721 31.572-17.603 42.42C452.875 233.28 437.845 240 421.24 240c-16.605 0-31.635 6.708-42.505 17.568-10.882 10.86-17.615 25.86-17.615 42.432 0 16.572-6.721 31.572-17.603 42.42C332.635 353.28 317.605 360 301 360c-16.605 0-31.635-6.72-42.505-17.58-10.882-10.848-17.615-25.848-17.615-42.42 0-16.572 6.733-31.572 17.615-42.432C269.365 246.708 284.395 240 301 240c16.605 0 31.635-6.72 42.517-17.58 10.882-10.848 17.603-25.848 17.603-42.42 0-33.144-26.91-60-60.12-60-16.605 0-31.635-6.72-42.505-17.58C247.613 91.572 240.88 76.572 240.88 60c0-16.572 6.733-31.572 17.615-42.432C269.365 6.708 284.395 0 301 0c33.21 0 60.12 26.856 60.12 60 0 16.572 6.733 31.572 17.615 42.42 10.87 10.86 25.9 17.58 42.505 17.58 33.21 0 60.12 26.856 60.12 60Z"
                  />
                  <path
                    fill="currentColor"
                    d="M240.88 180c0-33.138-26.916-60-60.12-60-33.203 0-60.12 26.862-60.12 60 0 33.137 26.917 60 60.12 60 33.204 0 60.12-26.863 60.12-60ZM120.64 300c0-33.137-26.917-60-60.12-60C27.317 240 .4 266.863.4 300c0 33.138 26.917 60 60.12 60 33.203 0 60.12-26.862 60.12-60ZM601.6 300c0-33.137-26.917-60-60.12-60-33.203 0-60.12 26.863-60.12 60 0 33.138 26.917 60 60.12 60 33.203 0 60.12-26.862 60.12-60Z"
                  />
                </svg>
              </div>
              <div className="flex items-center">
                <svg className="h-10 w-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" height="32" width="32">
                  <path fill="none" d="M0 0h256v256H0z" />
                  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16" d="m208 128-80 80M192 40 40 192" />
                </svg>
              </div>
              <div className="flex items-center">
                <svg className={cn("h-10 text-black dark:text-white")} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                  <path
                    d="m25.21 24.21-12.471 3.718a.525.525 0 0 1-.667-.606l4.456-21.511a.43.43 0 0 1 .809-.094l8.249 17.661a.6.6 0 0 1-.376.832Zm2.139-.878L17.8 2.883A1.531 1.531 0 0 0 16.491 2a1.513 1.513 0 0 0-1.4.729L4.736 19.648a1.592 1.592 0 0 0 .018 1.7l5.064 7.909a1.628 1.628 0 0 0 1.83.678l14.7-4.383a1.6 1.6 0 0 0 1-2.218Z"
                    fill="currentColor"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <div className="flex items-center">
                <StripeIcon className="mx-auto h-7 w-fit text-[#645cfc]" />
              </div>
              <div className="flex items-center">
                <svg
                  className={cn("mx-auto h-10 w-fit text-[#FFDD04] dark:text-[#FFDD04]")}
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  width="32"
                  height="32"
                  viewBox="0 0 64 64"
                  fill="currentColor"
                >
                  <defs>
                    <rect id="b" width="96" height="96" x="16" y="16" rx="2" />
                    <path
                      id="a"
                      d="M128 117v6a5 5 0 0 0-5 5h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0h-6a5 5 0 1 0-10 0H5a5 5 0 0 0-5-5v-6a5 5 0 1 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10v-6a5 5 0 0 0 0-10V5a5 5 0 0 0 5-5h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 0 0 10 0h6a5 5 0 1 0 10 0h6a5 5 0 0 0 5 5v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10v6a5 5 0 1 0 0 10z"
                    />
                  </defs>
                  <g fill="currentColor" fillRule="evenodd" transform="matrix(.4923 0 0 .4923 .492 .492)">
                    <use xlinkHref="#a" fill="#f0f0f0" />
                    <path
                      stroke="#ccc"
                      d="M128.5 116.5v7h-.5a4.5 4.5 0 0 0-4.5 4.5v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-9 0v.5h-7v-.5a4.5 4.5 0 0 0-4.5-4.5h-.5v-7H0a4.5 4.5 0 0 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0a4.5 4.5 0 1 0 0-9h-.5v-7H0A4.5 4.5 0 0 0 4.5 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 1 0 9 0v-.5h7V0a4.5 4.5 0 0 0 9 0v-.5h7V0a4.5 4.5 0 0 0 4.5 4.5h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9h.5v7h-.5a4.5 4.5 0 0 0 0 9z"
                    />
                    <path
                      stroke="#fff"
                      d="M127.5 117.478a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956v-5.044a5.5 5.5 0 0 1 0-10.956V5.478A5.502 5.502 0 0 1 122.522.5h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0h-5.044a5.5 5.5 0 0 1-10.956 0H5.478A5.502 5.502 0 0 1 .5 5.478v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.5 5.5 0 0 1 0 10.956v5.044a5.502 5.502 0 0 1 4.978 4.978h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.5 5.5 0 0 1 10.956 0h5.044a5.502 5.502 0 0 1 4.978-4.978z"
                    />
                    <use xlinkHref="#b" fill="#fedd00" />
                    <rect width="95" height="95" x="16.5" y="16.5" stroke="#d9b500" rx="2" />
                    <rect width="97" height="97" x="15.5" y="15.5" stroke="#726510" rx="2" />
                    <path
                      fill="#000"
                      d="M50.3 86.084V42.3H43V35h25.886c16.168 0 19.522 10.664 19.522 18.06 0 5.934-2.408 10.492-4.902 12.986-4.042 4.042-9.546 4.988-17.888 4.988h-6.536v15.05h7.654v7.3H43v-7.3zm8.772-22.102h7.3c10.75 0 13.072-4.988 13.072-11.008 0-6.88-3.87-10.664-10.32-10.664H59.082z"
                    />
                  </g>
                </svg>
              </div>

              <div className="flex items-center">
                <svg className="mx-auto h-8 w-fit" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
                  <path fill="#fff" d="M0 21.25h21.374v21.374H0z" />
                  <path fill="#99e1f4" d="M0 21.25h21.374v21.374H0z" />
                  <path fill="#fff" d="M21.374 42.626h21.25v21.25h-21.25z" />
                  <path fill="#99e1f4" d="M21.374 42.626h21.25v21.25h-21.25z" />
                  <path fill="#1a82e2" d="M0 63.877h21.374V64H0zm0-21.25h21.374v21.25H0z" />
                  <path fill="#00b3e3" d="M21.374 0h21.25v21.25h-21.25zm21.252 21.374H64v21.25H42.626z" />
                  <path fill="#009dd9" d="M21.374 42.626h21.25V21.25h-21.25z" />
                  <g fill="#1a82e2">
                    <path d="M42.626 0H64v21.25H42.626zM42.626 21.25H64v.123H42.626z" />
                  </g>
                </svg>
              </div>

              <div className="flex items-center">
                <svg className="mx-auto h-12 w-fit" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 600 600">
                  <path
                    fill="currentColor"
                    d="M186 447.471V154h132.062c18.726 0 35.635 4.053 50.728 12.158 15.373 8.105 27.391 19.285 36.055 33.54 8.665 13.974 12.997 29.906 12.997 47.793 0 18.447-4.332 35.077-12.997 49.89-8.664 14.534-20.543 25.994-35.636 34.378-15.092 8.385-32.142 12.578-51.147 12.578h-64.145v103.134H186Zm162.667 0L274.041 314.99l72.949-10.481L430 447.471h-81.333Zm-94.75-157.636h57.856c7.267 0 13.556-1.537 18.866-4.612 5.59-3.354 9.782-7.965 12.577-13.835 3.075-5.869 4.612-12.577 4.612-20.123 0-7.547-1.677-14.115-5.031-19.705-3.354-5.869-8.245-10.341-14.673-13.416-6.149-3.074-13.696-4.611-22.64-4.611h-51.567v76.302Z"
                  />
                </svg>
              </div>
            </InfiniteSlider>

            <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20"></div>
            <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20"></div>
            <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
            <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
          </div>
        </div>
      </div>
    </section>
  );
}
