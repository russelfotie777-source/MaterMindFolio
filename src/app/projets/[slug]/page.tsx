import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { classesCartouche, Fleche, NomVivant, Repere } from '@/components/Cartouche';
import { Copie } from '@/components/Copie';
import { LienExterne } from '@/components/LienExterne';
import { MediaProjet } from '@/components/MediaProjet';
import { lireCopieProjet } from '@/lib/copie/projets';
import { formaterJour, formaterPeriode } from '@/lib/dates';
import { lireProjet, lireProjets, SLUGS } from '@/lib/faits/projets';
import { PLATEFORMES, rangSurSix } from '@/lib/libelles';
import page from '@/styles/page.module.css';

import styles from './etude.module.css';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const projet = lireProjet((await params).slug);
  if (!projet) return {};
  return {
    title: projet.nom,
    description: `${projet.nom} : ${projet.role}. Étude de cas ${rangSurSix(projet.rang)} du portfolio de MASTERMIND.`,
    alternates: { canonical: `/projets/${projet.slug}` },
  };
}

// Étude de cas (DR-1, vue A06), en lecture linéaire et sans JavaScript : média produit sur 7 colonnes,
// périmètre et preuve sur 5. Sans média, rôle, périmètre et preuve gardent toute la surface.
// Dans le monde (décision de Russel du 25 octobre 2026), l'en-tête est un cartouche : la caméra se pose
// face à l'écran 3D du projet, à droite, et un trait relie son cadre au rang du projet.
export default async function EtudeDeCas({ params }: Props) {
  const projet = lireProjet((await params).slug);
  if (!projet) notFound();
  const projets = lireProjets();
  const precedent = projets[projet.rang - 2];
  const suivant = projets[projet.rang];
  const { organisation, equipe } = projet;
  // Textes de Codex visés par Russel ; une section absente n'affiche rien.
  const copie = lireCopieProjet(projet.slug);
  const [site] = projet.liens;

  return (
    <div className={page.cadre}>
      <article className={page.plaque} data-etude>
        <header className={styles.entete} data-cartouche>
          <Repere rang={projet.rang} total={projets.length} />
          <p className={classesCartouche.meta} data-apparait>
            Étude de cas · {projet.periode.debut.slice(0, 4)} ·{' '}
            {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
          </p>
          <NomVivant nom={projet.nom} niveau={1} />
          <p className={`${page.lead} ${styles.role}`} data-apparait>
            {projet.role}
          </p>
          {site && (
            <p data-apparait>
              <LienExterne className={classesCartouche.appel} href={site.url}>
                <span>{site.libelle}</span>
                <Fleche vers="dehors" />
              </LienExterne>
            </p>
          )}
        </header>

        {copie.need && (
          <section className={`${page.rubrique} ${styles.besoin}`}>
            <h2>Besoin</h2>
            <Copie arbre={copie.need} />
          </section>
        )}

        <div className={styles.belvedere}>
          <MediaProjet
            slug={projet.slug}
            tailles="(min-width: 1280px) 42rem, 55vw"
            prioritaire
            legende={copie['product-caption'] && <Copie arbre={copie['product-caption']} />}
          />
          <div className={styles.preuves}>
            <section className={page.rubrique}>
              <h2>Périmètre validé</h2>
              <ul role="list" className={`${page.liste} ${styles.perimetre}`}>
                {projet.perimetre.map((element) => (
                  <li key={element}>{element}</li>
                ))}
              </ul>
            </section>

            <section className={page.rubrique}>
              <h2>Preuve publique</h2>
              <ul role="list" className={page.liste}>
                {projet.preuves.map((preuve) => (
                  <li key={preuve.libelle} className={styles.preuve}>
                    <span className={page.fort}>
                      {preuve.url ? (
                        <LienExterne href={preuve.url}>{preuve.libelle}</LienExterne>
                      ) : (
                        preuve.libelle
                      )}
                    </span>
                    <span className={page.attenue}>Vérifiée le {formaterJour(preuve.verifieeLe)}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>

        <div className={page.grille}>
          {copie['case-study'] && (
            <section className={`${page.rubrique} ${styles.bandeau} ${styles.recit}`}>
              <h2>Étude</h2>
              <Copie arbre={copie['case-study']} />
            </section>
          )}

          {projet.decisions.length > 0 && (
            <section className={`${page.rubrique} ${styles.bandeau}`}>
              <h2>Décisions</h2>
              <dl className={styles.decisions}>
                {projet.decisions.map((decision) => (
                  <div key={decision.titre}>
                    <dt className={page.fort}>{decision.titre}</dt>
                    <dd className={page.attenue}>{decision.raison}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <section className={`${page.rubrique} ${styles.bandeau}`}>
            <h2>Repères</h2>
            <dl className={styles.reperes}>
              <div>
                <dt>Statut</dt>
                <dd>{projet.statut}</dd>
              </div>
              <div>
                <dt>Période</dt>
                <dd>
                  {formaterPeriode(projet.periode)}
                  {projet.periode.phases.length > 0 && (
                    <ul role="list" className={page.liste}>
                      {projet.periode.phases.map((phase) => (
                        <li key={phase.libelle} className={page.attenue}>
                          {phase.libelle} :{' '}
                          {formaterPeriode({ ...phase, enCours: false, approximative: false })}
                        </li>
                      ))}
                    </ul>
                  )}
                </dd>
              </div>
              <div>
                <dt>Organisation</dt>
                <dd>
                  {organisation.nom} · {organisation.ville ? `${organisation.ville}, ` : ''}
                  {organisation.pays}
                </dd>
              </div>
              {equipe && (
                <div>
                  <dt>Équipe</dt>
                  <dd>
                    {equipe.taille !== null && (
                      <>{equipe.taille > 1 ? `${equipe.taille} personnes` : '1 personne'}</>
                    )}
                    {equipe.note && <> · {equipe.note}</>}
                    {equipe.membres.length > 0 && (
                      <ul role="list" className={page.liste}>
                        {equipe.membres.map((membre) => (
                          <li key={membre.nom}>
                            {membre.nom} : {membre.contribution}
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              )}
              <div>
                <dt>Plateformes</dt>
                <dd>{projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}</dd>
              </div>
              <div>
                <dt>Technologies</dt>
                <dd>{projet.technologies.join(' · ')}</dd>
              </div>
              <div>
                <dt>Liens</dt>
                <dd>
                  <ul role="list" className={page.liste}>
                    {projet.liens.map((lien) => (
                      <li key={lien.url}>
                        <LienExterne href={lien.url}>{lien.libelle}</LienExterne>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </article>

      <nav aria-label="Autres projets" className={styles.suite}>
        <ul role="list" className={page.liste}>
          {precedent && (
            <li>
              <Link href={`/projets/${precedent.slug}`}>Projet précédent : {precedent.nom}</Link>
            </li>
          )}
          {suivant && (
            <li>
              <Link href={`/projets/${suivant.slug}`}>Projet suivant : {suivant.nom}</Link>
            </li>
          )}
          <li>
            <Link href="/projets">Les six projets</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
