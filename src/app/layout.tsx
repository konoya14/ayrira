import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
title: "Ayrira — Premium Digital Store",
description: "Temukan produk digital favoritmu di Ayrira.",
};

export default function RootLayout({
children,
}: Readonly<{ children: React.ReactNode }>) {
return (
<html lang="id">
<body>{children}</body>
</html>
);
}
