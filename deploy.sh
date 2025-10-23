#!/bin/bash
set -e

echo "🚀 Iniciando deploy automático do Hub Evoluti 360°..."

# 1. Limpar arquivos desnecessários
echo "🧹 Limpando arquivos antigos..."
rm -f app-juridico/main.c app-juridico/employee.h app-juridico/employee.c
rm -rf app-juridico/dist

# 2. Preparar backend
echo "📦 Preparando backend..."
if [ ! -f server.js ]; then
  cp app-juridico/web/server.js server.js
  sed -i '' 's|../react-frontend/build|app-juridico/react-frontend/build|g' server.js
fi

cat > package.json << 'PKGJSON'
{
  "name": "hub-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1"
  }
}
PKGJSON

# 3. Commit
echo "💾 Fazendo commit..."
git add .
git commit -m "Auto deploy $(date +%Y-%m-%d_%H:%M:%S)" || echo "Nada para commitar"
git push origin main

# 4. Deploy backend no Railway
echo "🚂 Fazendo deploy no Railway..."
npx -y @railway/cli link 336b2c91-35b2-452f-a2c3-9523245b117a
npx -y @railway/cli up

# 5. Obter URL do Railway
echo "🔗 Obtendo URL do backend..."
RAILWAY_URL=$(npx -y @railway/cli domain | grep -o 'https://[^[:space:]]*' | head -1)

if [ -z "$RAILWAY_URL" ]; then
  echo "⚠️  Gere o domínio manualmente no Railway:"
  echo "   https://railway.com/project/336b2c91-35b2-452f-a2c3-9523245b117a"
  echo "   Settings → Networking → Generate Domain"
  read -p "Cole a URL aqui: " RAILWAY_URL
fi

echo "✅ Backend: $RAILWAY_URL"

# 6. Build do frontend
echo "🎨 Fazendo build do frontend..."
cd app-juridico/react-frontend
echo "REACT_APP_API_URL=${RAILWAY_URL}/api" > .env.production
npm install
npm run build

# 7. Deploy frontend no Netlify
echo "🌐 Fazendo deploy no Netlify..."
npx -y netlify-cli deploy --prod --dir=build --site hub-evoluti-360 || \
npx -y netlify-cli deploy --prod --dir=build

cd ../..

echo ""
echo "✅ DEPLOY COMPLETO!"
echo ""
echo "🔗 Links:"
echo "   Backend:  $RAILWAY_URL"
echo "   Frontend: Veja acima a URL do Netlify"
echo ""
echo "🔐 Credenciais de teste:"
echo "   RH: rh@empresa.com / rh123"
echo "   Admin: admin@empresa.com / admin123"
echo ""
echo "📱 Para instalar no celular:"
echo "   - Android: Abra o link → 'Adicionar à tela inicial'"
echo "   - iOS: Safari → Compartilhar → 'Adicionar à Tela de Início'"
