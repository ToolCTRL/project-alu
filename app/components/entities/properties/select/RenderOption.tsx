import { Fragment } from "react";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "~/components/ui/badges/ColorBadge";
import { SelectOptionsDisplay } from "~/utils/shared/SelectOptionsUtils";

export default function RenderOption({
  option,
  hasColors,
  display,
}: Readonly<{
  option:
    | {
        name?: string | null;
        value: string;
        color?: Colors | number;
      }
    | undefined;
  hasColors: boolean;
  display?: SelectOptionsDisplay;
}>) {
  if (!option) {
    return null;
  }

  return (
    <Fragment>
      {display ? (
        <div className="flex space-x-2 truncate">
          {display === "Name" && (option.name ?? option.value)}
          {display === "Value" && option.value}
          {display === "Color" && <ColorBadge color={option.color} />}
          {display === "ColorWithTitle" && (
            <Fragment>
              <div>
                <ColorBadge color={option.color} />
              </div>
              {option.color !== undefined && option.color !== null && <div className="capitalize">{Colors[option.color]?.toLowerCase()}</div>}
            </Fragment>
          )}
          {display === "NameAndValue" && (
            <Fragment>
              {option.name}
              {option.name && option.value && " - "}
              {option.value}
            </Fragment>
          )}
          {display === "ValueAndName" && (
            <Fragment>
              {option.value}
              {option.name && option.value && " - "}
              {option.name}
            </Fragment>
          )}
          {display === "NameValueAndColor" && (
            <Fragment>
              <div>
                <ColorBadge color={option.color} />
              </div>
              <div>
                {option.name}
                {option.name && option.value && " - "}
                {option.value}
              </div>
            </Fragment>
          )}

          {display === "ValueNameAndColor" && (
            <Fragment>
              <div>
                <ColorBadge color={option.color} />
              </div>
              <div>
                {option.value}
                {option.name && option.value && " - "}
                {option.name}
              </div>
            </Fragment>
          )}
          {display === "NameAndColor" && (
            <Fragment>
              <div>
                <ColorBadge color={option.color} />
              </div>
              <div>{option.name}</div>
            </Fragment>
          )}
          {display === "ValueAndColor" && (
            <Fragment>
              <div>
                <ColorBadge color={option.color} />
              </div>
              <div>{option.value}</div>
            </Fragment>
          )}
        </div>
      ) : (
        <Fragment>
          {option.name ? (
            option.name
          ) : (
            <>
              {option.value}
              {option.name && option.value && " - "}
              {option.name}
            </>
          )}
        </Fragment>
      )}
    </Fragment>
  );
}
