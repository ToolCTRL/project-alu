export default function EntityIcon({ className, icon, title }: Readonly<{ className?: string; icon?: string; title?: string }>) {
  if (!icon) {
    return null;
  }

  if (icon.startsWith("<svg")) {
    return <div dangerouslySetInnerHTML={{ __html: icon.replace("<svg", `<svg class='${className}'`) ?? "" }} />;
  }

  if (icon.includes("http")) {
    return <img className={className} src={icon} alt={title} />;
  }

  return null;
}
