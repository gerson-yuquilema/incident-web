import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Le dice a Jest dónde está la app de Next.js para cargar la configuración
  dir: './',
})

// Configuración personalizada de Jest
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
}

export default createJestConfig(config)