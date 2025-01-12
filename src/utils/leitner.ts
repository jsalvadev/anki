interface Card {
  id: string; // Identificador único
  frontImage?: string; // Imagen frontal (opcional)
  frontDescription?: string; // Descripción frontal (opcional)
  frontSentence?: string; // Frase frontal (opcional)
  backWord?: string; // Palabra posterior (opcional)
  backSentence?: string; // Frase posterior (opcional)
  backTranslation?: string; // Traducción (opcional)
  wordAudioUrl?: string; // URL del audio de la palabra (opcional)
  sentenceAudioUrl?: string; // URL del audio de la frase (opcional)
  level: number; // Nivel actual en el sistema Leitner (1-6)
  nextReview: Date; // Fecha de la próxima revisión
}

export class LeitnerSystem {
  // Array para almacenar las tarjetas
  private cards: Card[] = [];

  // Definición de los intervalos de repaso en días para cada nivel
  private readonly LEVELS = {
    1: 1, // Nivel 1: revisar al día siguiente
    2: 3, // Nivel 2: revisar en 3 días
    3: 7, // Nivel 3: revisar en 7 días
    4: 14, // Nivel 4: revisar en 14 días
    5: 30, // Nivel 5: revisar en 30 días
    6: 90 // Nivel 6: revisar en 90 días
  };

  constructor() {
    // Al crear una instancia, carga las tarjetas guardadas
    this.loadFromStorage();
  }

  // Método para añadir una nueva tarjeta
  addCard(cardData: Omit<Card, 'id' | 'level' | 'nextReview'>): void {
    const newCard: Card = {
      ...cardData,
      id: crypto.randomUUID(), // Genera un ID único
      level: 1, // Comienza en nivel 1
      nextReview: new Date() // Revisar desde hoy
    };
    this.cards.push(newCard);
    this.saveToStorage();
  }

  // Obtiene las tarjetas que deben revisarse hoy
  getCardsForToday(): Card[] {
    const today = new Date();
    return this.cards.filter(card => card.nextReview <= today);
  }

  // Procesa la respuesta a una tarjeta
  processAnswer(cardId: string, isCorrect: boolean): void {
    const cardIndex = this.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;

    const card = this.cards[cardIndex];

    if (isCorrect) {
      // Si la respuesta es correcta, sube de nivel (máximo 6)
      const newLevel = Math.min(card.level + 1, 6);
      const daysToAdd = this.LEVELS[newLevel as keyof typeof this.LEVELS];

      this.cards[cardIndex] = {
        ...card,
        level: newLevel,
        nextReview: this.addDays(new Date(), daysToAdd)
      };
    } else {
      // Si la respuesta es incorrecta, vuelve al nivel 1
      this.cards[cardIndex] = {
        ...card,
        level: 1,
        nextReview: this.addDays(new Date(), 1)
      };
    }

    this.saveToStorage();
  }

  // Utilidad para añadir días a una fecha
  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Guarda las tarjetas en localStorage
  private saveToStorage(): void {
    localStorage.setItem('anki-cards', JSON.stringify(this.cards));
  }

  // Carga las tarjetas desde localStorage
  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      // Comprueba si estamos en el navegador
      const saved = localStorage.getItem('anki-cards');
      if (saved) {
        this.cards = JSON.parse(saved).map((card: Card) => ({
          ...card,
          nextReview: new Date(card.nextReview)
        }));
      }
    }
  }
}
