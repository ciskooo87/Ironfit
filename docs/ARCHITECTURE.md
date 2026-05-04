# RouteFit AI / Ironfit - Arquitetura MVP

## Objetivo do MVP
Recomendar 3 rotas candidatas:
1. Melhor geral
2. Performance
3. Mais segura

## Fontes de dados
### MVP
- Google Maps API
  - geocoding
  - directions / routes
  - trânsito atual
  - padrão por horário

### Fase 2
- Strava
  - popularidade
  - comportamento de atletas
  - segmentos

## Camadas
### Frontend
- Next.js App Router
- formulários de treino
- resultado com 3 rotas
- detalhe da rota
- histórico

### Backend lógico
- endpoint `/api/routes/recommend`
- normalização do input
- geração de candidatas
- scoring por regra
- explicação textual por rota

### Persistência
- PostgreSQL
- PostGIS para geometria e consultas futuras

## Estratégia de implementação
### Etapa 1
- Google Maps integrado
- candidatas simples
- score simples
- salvar rotas

### Etapa 2
- heurísticas melhores
- popularidade real
- Strava
- personalização por perfil

## Princípios
- primeiro deploy > perfeição
- sem overengineering
- regras simples antes de IA complexa
- explicação clara da recomendação
