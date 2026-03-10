# next-web Domain Kuralları

## Aktif Olma Koşulu

package.json içinde "next" dependency mevcut.

## Font Tercihi

- Geist → birinci tercih
- Inter → kabul edilebilir alternatif
- Roboto, Arial → YASAK

## MCP Seçim Protokolü

Aynı anda birden fazla UI MCP çağırma. Önce hangisi gerektiğine karar ver:

- Yeni component üretmek → 21st-dev-magic
- Mevcut shadcn component'i kurmak/değiştirmek → shadcn MCP
- Animasyon/motion component → @magicuidesign/mcp

## Skill Yükleme Sırası

P0 (her zaman): nextjs-react-expert, nextjs-app-router-patterns
P1 (UI görevi varsa): frontend-design, tailwind-patterns
P2 (özellikle istenirse): seo-fundamentals, geo-fundamentals

## Primary Agent

frontend-specialist
