# RouteFit AI

MVP inicial do app de recomendação de rotas para corrida e bike.

## Objetivo
Gerar 3 recomendações de rota:
- Melhor geral
- Performance
- Mais segura

Com base em:
- local
- data/horário
- modalidade
- distância
- tipo de treino
- preferências do usuário

## Stack atual
- Next.js 16
- React
- Tailwind CSS
- TypeScript

## Status atual
MVP funcional de produto com:
- onboarding
- home com formulário
- endpoint interno de recomendação
- home com submit client-side para `/api/routes/recommend`
- geração de 3 rotas com fallback por regras e preparação para Google Maps
- detalhe da rota puxando dados reais do histórico salvo
- mapa com Google Static Maps quando houver polyline e key pública configurada
- histórico salvo em arquivo local (`.data`) ou PostgreSQL, dependendo do ambiente
- persistência de polyline e tentativa de `route_geometry` no PostGIS
- login MVP por cookie para amarrar usuário ao fluxo
- manual interno

## Próximo bloco
1. login real
2. PostgreSQL + PostGIS (camada híbrida já preparada no código)
3. integração Google Maps API mais robusta
4. salvar rotas no banco de verdade
5. trocar fallback por candidatas reais completas

## Variáveis esperadas para próxima fase
Criar `.env.local` com algo como:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
DATABASE_URL=
```

## Banco local (PostgreSQL + PostGIS)
```bash
chmod +x scripts/db-setup.sh
./scripts/db-setup.sh
```

Depois configure `.env.local` com:
```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5434/ironfit
```

## Desenvolvimento
```bash
npm install
npm run dev
npm run build
```
