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
- histórico salvo em arquivo local (`.data`)
- manual interno

## Próximo bloco
1. login real
2. PostgreSQL + PostGIS
3. integração Google Maps API
4. salvar rotas
5. trocar mock por geração real de candidatas

## Variáveis esperadas para próxima fase
Criar `.env.local` com algo como:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
DATABASE_URL=
```

## Desenvolvimento
```bash
npm install
npm run dev
npm run build
```
