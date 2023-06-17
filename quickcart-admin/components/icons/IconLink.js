import Link from "next/link";
import {useRouter} from "next/router";

export function IconLink({isHome=false, isHeader=false, isActive=false, href="/", icon, name="name"}) {
    const {pathname} = useRouter();
    if (pathname.includes(href)  && !isHeader && !isHome) {
        isActive = true;
    } else if (pathname === href && isHome) {
        isActive = true;
    }
    const base = isHeader?"flex gap-1 mr-4 mb-4":"flex gap-1 p-1 border-0"
    const active = isActive?base+" bg-highlight text-primary rounded-md":base
    return <Link className={active} href={href}>
        {icon}
        <span>{name}</span>
    </Link>
}