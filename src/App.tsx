import { useEffect, useState } from 'react';
import { db, sanitizeString } from './lib/db';
import type { Maestro } from './lib/types';
import WelcomeScreen from './screens/WelcomeScreen';
import Dashboard from './screens/Dashboard';
import GradosScreen from './screens/GradosScreen';

type Pantalla = 'dashboard' | 'grados';

function App() {
  const [maestro, setMaestro] = useState<Maestro | null>(null);
  const [nombreInput, setNombreInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('dashboard');

  useEffect(() => {
    const loadData = async () => {
      try {
        const maestroExistente = await db.maestro.toArray();
        if (maestroExistente.length > 0) {
          setMaestro(maestroExistente[0]);
        }

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
          setDarkMode(true);
          document.documentElement.classList.add('dark');
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const guardarNombre = async () => {
    const nombreLimpio = sanitizeString(nombreInput);

    if (nombreLimpio.length < 2) {
      alert('Por favor ingresa un nombre valido');
      return;
    }

    try {
      const nuevoMaestro: Maestro = {
        id: 'maestro1',
        nombre: nombreLimpio,
      };

      await db.maestro.put(nuevoMaestro);
      setMaestro(nuevoMaestro);
      setNombreInput('');
    } catch (error) {
      console.error('Error al guardar maestro:', error);
      alert('Hubo un error al guardar tu nombre');
    }
  };

  const toggleDarkMode = () => {
    const nuevoModo = !darkMode;
    setDarkMode(nuevoModo);

    if (nuevoModo) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        Cargando ProfeControl...
      </div>
    );
  }

  if (!maestro) {
    return (
      <WelcomeScreen
        nombreInput={nombreInput}
        setNombreInput={setNombreInput}
        onGuardar={guardarNombre}
      />
    );
  }

  switch (pantallaActual) {
    case 'grados':
      return (
        <GradosScreen
          maestro={maestro}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onVolver={() => setPantallaActual('dashboard')}
        />
      );

    case 'dashboard':
    default:
      return (
        <Dashboard
          maestro={maestro}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onIrAGrados={() => setPantallaActual('grados')}
        />
      );
  }
}

export default App;