import { Facebook, Instagram, Scissors, Twitter } from "lucide-react";

export function Footer() {
  return (
       <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-4">
                    <div className="bg-neutral-900 p-1.5 rounded-md">
                         <Scissors className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-neutral-900">BarberBook</span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                    A plataforma completa para gestão de barbearias modernas. Simplifique seu dia a dia.
                </p>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-4">Produto</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-neutral-900">Funcionalidades</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Planos</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Para Barbeiros</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Para Clientes</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-4">Suporte</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-neutral-900">Central de Ajuda</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Fale Conosco</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Termos de Uso</a></li>
                    <li><a href="#" className="hover:text-neutral-900">Privacidade</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-gray-900 mb-4">Redes Sociais</h4>
                <div className="flex gap-4">
                    <a href="#" className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-neutral-900 hover:text-white transition-colors">
                        <Instagram className="h-5 w-5" />
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-neutral-900 hover:text-white transition-colors">
                        <Facebook className="h-5 w-5" />
                    </a>
                    <a href="#" className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 hover:bg-neutral-900 hover:text-white transition-colors">
                        <Twitter className="h-5 w-5" />
                    </a>
                </div>
            </div>

        </div>

        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} BarberBook. Todos os direitos reservados.
            </p>
            <div className="flex gap-6">
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacidade</a>
                <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Termos</a>
            </div>
        </div>

      </div>
    </footer>
  );
}
