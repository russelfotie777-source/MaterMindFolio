import { CopierAdresse } from '@/components/CopierAdresse';
import { lireProfil } from '@/lib/faits/profil';

export default function Accueil() {
  const profil = lireProfil();

  return (
    <main>
      <h1>{profil.nomPublic}</h1>
      <p>{profil.intitule}</p>
      <p>{profil.disponibilite}</p>
      <CopierAdresse adresse={profil.email} />
    </main>
  );
}
