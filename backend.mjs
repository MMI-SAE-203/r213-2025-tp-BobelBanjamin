import PocketBase from 'pocketbase' ;
const pb = new PocketBase('http://127.0.0.1:8090');



export async function allMaisons() {
    let maisons = await pb.collection('maisons').getFullList({ 
    });

    maisons = maisons.map((maison) => {
        maison.imgUrl = pb.files.getURL(maison, maison.Images); 
        return maison;
    });

    return maisons;
}

export async function allMaisonsFavoris() {    
    let Favoris = await pb.collection('maisons').getFullList( { 
        filter: 'maisonFavori = true'
    } );

    Favoris = Favoris.map((maison) => {
        maison.imgUrl = pb.files.getURL(maison, maison.Images); 
        return maison;
    });

    return Favoris;
}

export async function getOffre(id) {

        let data = await pb.collection('maisons').getOne(id);
        data.imageUrl = pb.files.getURL(data, data.Images);
        return data;
   
}


    export async function OneID(id) {
        const oneRecords = await pb.collection('maisons').getOne(id) ;
        return oneRecords ;
     }
        
        
        
        
        export async function allMaisonsSorted() {
        const Prix = await pb.collection('maisons').getFullList({ sort: 'prix'}
            ) ;
        return Prix ;
        }
        
        export async function bySurface(s) {
        let Surface = await pb.collection('maisons').getFullList({ filter: `surface > ${s}`,}
            ) ;
        return Surface ;
        }
        
        export async function surfaceORprice(s,p) {
        const SurfaceORPrix = await pb.collection('maisons').getFullList({ filter: `surface > ${s} && prix < ${p}` }
            ) ;
        return SurfaceORPrix ;
        }
        
        export async function byPrix(prix) {
                let data = await pb.collection('maisons').getFullList({
                    filter: `prix < ${prix}`
                });
                data.forEach(maison => {
                    maison.imageUrl = pb.files.getURL(maison, maison.Image);
                });
                return data;
        }


        export async function getStaticPaths() {
            // Récupérer toutes les maisons depuis PocketBase
            const maisons = await pb.collection('maisons').getFullList();
        
            // Créer des chemins dynamiques
            return maisons.map((maison) => ({
                params: { id: maison.id.toString() },
                props: { maison },
            }));
        }

        export async function addOffre(house) {
            try {
                // Vérifier si une image a été envoyée
                let formData = new FormData();
                formData.append("nomMaison", house.nomMaison);
                formData.append("prix", house.prix);
                formData.append("nbSdb", house.nbSdb);
                formData.append("nbChambres", house.nbChambres);
                formData.append("surface", house.surface);
        
                if (house.image) {
                    formData.append("images", house.image); // "images" correspond au champ dans ta base de données
                }
        
                // Ajouter l'offre à la collection "maisons"
                await pb.collection("maisons").create(formData);
        
                return {
                    success: true,
                    message: "Offre ajoutée avec succès !"
                };
            } catch (error) {
                console.error("Une erreur est survenue en ajoutant la maison", error);
                return {
                    success: false,
                    message: "Une erreur est survenue en ajoutant la maison."
                };
            }
        }
        

        export async function filterByPrix(prixMin, prixMax) {
            try {
                let data = await pb.collection('maisons').getFullList({
                    sort: '-created',
                    filter: `prix >= ${prixMin} && prix <= ${prixMax}`
                });
                data = data.map((maison) => {
                    maison.imageUrl = pb.files.getURL(maison, maison.image);
                    return maison;
                });
                return data;
            } catch (error) {
                console.log('Une erreur est survenue en filtrant la liste des maisons', error);
                return [];
            }
        }