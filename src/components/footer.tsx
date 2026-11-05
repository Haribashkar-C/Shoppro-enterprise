import Link from "next/link";
export function Footer(){return <footer><div className="container footer-inner"><strong className="logo">ShopPro</strong><span>Enterprise shopping, made simple.</span><span>Secure checkout · Reliable support · Easy returns</span><span>© {new Date().getFullYear()} ShopPro</span><Link href="/account">My account</Link></div></footer>}
