import { ThemeToggle } from './components/ThemeToggle.tsx'
import { QuizPage } from './pages/QuizPage.tsx'

function App() {
  return (
    <>
      <div className="app-header">
        <ThemeToggle />
      </div>
      <QuizPage />
    </>
  )
}

export default App
