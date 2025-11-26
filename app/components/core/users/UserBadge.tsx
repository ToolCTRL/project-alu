import { AdminUser, Role, UserRole } from "@prisma/client";
import { useTranslation } from "react-i18next";
import AtSymbolIcon from "~/components/ui/icons/AtSymbolIcon";
import GitHubIcon from "~/components/ui/icons/GitHubIcon";
import GoogleIcon from "~/components/ui/icons/GoogleIcon";
import UserAvatarBadge from "./UserAvatarBadge";
import { Link } from "react-router";
import { DefaultAdminRoles } from "~/application/dtos/shared/DefaultAdminRoles";

interface Props {
  readonly item: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
    githubId?: string | null;
    googleId?: string | null;
  };
  readonly admin?: AdminUser | null;
  readonly withEmail?: boolean;
  readonly withAvatar?: boolean;
  readonly withSignUpMethod?: boolean;
  readonly showCurrent?: boolean;
  readonly href?: string;
  readonly roles?: (UserRole & { role: Role })[];
}
export default function UserBadge(props: Readonly<Props>) {
  return <Item {...props} />;
}

function Item({ item, admin, withEmail = true, withAvatar, withSignUpMethod, showCurrent, href, roles }: Readonly<Props>) {
  const { t } = useTranslation();
  function isAdmin() {
    if (admin) {
      return true;
    }
    let isAdmin = false;
    roles?.forEach((role) => {
      if ([DefaultAdminRoles.SuperAdmin].map((f) => f.toString()).includes(role.role.name)) {
        isAdmin = true;
      }
    });
    return isAdmin;
  }
  return (
    <>
      {withAvatar ? (
        <div className="group flex items-center">
          <UserAvatarBadge avatar={item.avatar} />
          <div className="ml-3 truncate">
            <div className="truncate font-medium">
              {href ? (
                <Link to={href} className="group-hover:underline">
                  <span className="truncate">
                    {item.firstName} {item.lastName} {isAdmin() && <span className="text-xs text-teal-500">({t("shared.adminAccess")})</span>}{" "}
                  </span>
                </Link>
              ) : (
                <span className="truncate">
                  {item.firstName} {item.lastName} {isAdmin() && <span className="text-xs text-teal-500">({t("shared.adminAccess")})</span>}{" "}
                </span>
              )}
              {showCurrent && <span className="text-xs font-normal italic opacity-80">({t("shared.you")})</span>}
            </div>
            <div className="flex items-center space-x-1 truncate truncate opacity-80">
              {withSignUpMethod && (
                <>
                  {(() => {
                    if (item.githubId) {
                      return (
                        <a href={"https://api.github.com/user/" + item.githubId} target="_blank" rel="noreferrer" title="GitHub profile">
                          <GitHubIcon className="text-muted-foreground h-4 w-4" />
                        </a>
                      );
                    }
                    if (item.googleId) {
                      return <GoogleIcon className="text-muted-foreground h-4 w-4" />;
                    }
                    return <AtSymbolIcon className="text-muted-foreground h-4 w-4" />;
                  })()}
                </>
              )}
              <div className="truncate">{item.email}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="group">
          {href ? (
            <Link to={href} className="group-hover:underline">
              <span>
                {item.firstName} {item.lastName} {withEmail && <span className="text-xs font-normal italic opacity-80">({item.email})</span>}
              </span>
            </Link>
          ) : (
            <span>
              {item.firstName} {item.lastName} {withEmail && <span className="text-xs font-normal italic opacity-80">({item.email})</span>}
            </span>
          )}
        </div>
      )}
    </>
  );
}
