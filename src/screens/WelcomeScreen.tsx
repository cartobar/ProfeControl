import { GraduationCap } from 'lucide-react';

type WelcomeScreenProps = {
  nombreInput: string;
  setNombreInput: (value: string) => void;
  onGuardar: () => void;
};

export default function WelcomeScreen({
  nombreInput,
  setNombreInput,
  onGuardar,
}: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full">
        <div className="text-center mb-10">
          <GraduationCap className="w-20 h-20 mx-auto text-blue-600 mb-6" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">ProfeControl</h1>
          <p className="text-gray-600">Tu asistente para la gestion escolar</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ¿Como debemos llamarte?
            </label>
            <input
              type="text"
              value={nombreInput}
              onChange={(e) => setNombreInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onGuardar()}
              placeholder="Carlos"
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              autoFocus
            />
          </div>

          <button
            onClick={onGuardar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition-all text-lg shadow-md"
          >
            Iniciar
          </button>
        </div>
      </div>
    </div>
  );
}