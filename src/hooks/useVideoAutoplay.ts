import { useEffect, RefObject } from 'react'

/**
 * Hook pour forcer l'autoplay des vidéos sur mobile
 * Gère les cas où l'autoplay est bloqué par le navigateur
 */
export function useVideoAutoplay(videoRef: RefObject<HTMLVideoElement>) {
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Fonction pour tenter de lire la vidéo
    const playVideo = async () => {
      try {
        await video.play()
      } catch (error) {
        // Si l'autoplay échoue, on réessaie lors de l'interaction utilisateur
        console.log('Autoplay bloqué, en attente d\'interaction utilisateur')
        
        const handleInteraction = async () => {
          try {
            await video.play()
            // Nettoyer les écouteurs une fois la vidéo lancée
            document.removeEventListener('touchstart', handleInteraction)
            document.removeEventListener('click', handleInteraction)
          } catch (e) {
            console.error('Erreur lors de la lecture vidéo:', e)
          }
        }

        // Ajouter des écouteurs pour les interactions utilisateur
        document.addEventListener('touchstart', handleInteraction, { once: true })
        document.addEventListener('click', handleInteraction, { once: true })
      }
    }

    // Attendre que la vidéo soit chargée
    if (video.readyState >= 3) {
      playVideo()
    } else {
      video.addEventListener('loadeddata', playVideo)
      return () => video.removeEventListener('loadeddata', playVideo)
    }
  }, [videoRef])
}

