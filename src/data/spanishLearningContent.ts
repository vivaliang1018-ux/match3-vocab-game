/**
 * Learner-facing Spanish vocabulary that intentionally differs from the
 * canonical Unicode CLDR emoji short name.
 *
 * Keep these entries staged until a recording with the exact `learningName`
 * has passed the audio pipeline. This prevents the UI from showing one phrase
 * while the recorded clip says another.
 */
export type SpanishLearningContentOverride = {
  learningName: string;
  canonicalName: string;
  audioStatus: 'pending' | 'ready';
  reason: 'grammar-fix' | 'learner-clarity';
};

export const SPANISH_LEARNING_CONTENT_OVERRIDES: Readonly<
  Record<string, SpanishLearningContentOverride>
> = {
  '😦': {
    canonicalName: 'cara con el ceño fruncido y la boca abierta',
    learningName: 'cara preocupada con la boca abierta',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '😜': {
    canonicalName: 'cara sacando la lengua y guiñando un ojo',
    learningName: 'cara guiñando un ojo y sacando la lengua',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🤐': {
    canonicalName: 'cara con la boca cerrada con cremallera',
    learningName: 'boca con cremallera',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🫢': {
    canonicalName: 'cara con ojos abiertos y boca tapada',
    learningName: 'cara sorprendida con la boca tapada',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🫰': {
    canonicalName: 'mano con dedo índice y pulgar cruzados',
    learningName: 'corazón con los dedos',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👈': {
    canonicalName: 'dorso de mano con índice a la izquierda',
    learningName: 'dedo apuntando a la izquierda',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👉': {
    canonicalName: 'dorso de mano con índice a la derecha',
    learningName: 'dedo apuntando a la derecha',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👆': {
    canonicalName: 'dorso de mano con índice hacia arriba',
    learningName: 'dedo apuntando hacia arriba',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👇': {
    canonicalName: 'dorso de mano con índice hacia abajo',
    learningName: 'dedo apuntando hacia abajo',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🙆‍♀️': {
    canonicalName: 'mujer haciendo el gesto de de acuerdo',
    learningName: 'mujer haciendo el gesto de OK',
    audioStatus: 'ready',
    reason: 'grammar-fix',
  },
  '🌦️': {
    canonicalName: 'sol detrás de una nube con lluvia',
    learningName: 'sol y lluvia',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🤣': {
    canonicalName: 'cara revolviéndose de la risa',
    learningName: 'cara riendo a carcajadas',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '😝': {
    canonicalName: 'cara con ojos cerrados y lengua fuera',
    learningName: 'cara con lengua fuera',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🤗': {
    canonicalName: 'cara con manos abrazando',
    learningName: 'cara dando un abrazo',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🤭': {
    canonicalName: 'cara con mano sobre la boca',
    learningName: 'cara tapándose la boca',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🫣': {
    canonicalName: 'cara tapada con ojo espiando',
    learningName: 'cara mirando entre los dedos',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🫥': {
    canonicalName: 'cara con línea de puntos',
    learningName: 'cara desapareciendo',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🫤': {
    canonicalName: 'cara con boca diagonal',
    learningName: 'cara indecisa',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🙁': {
    canonicalName: 'cara con el ceño ligeramente fruncido',
    learningName: 'cara un poco triste',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🤬': {
    canonicalName: 'cara con símbolos en la boca',
    learningName: 'cara diciendo palabrotas',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👌': {
    canonicalName: 'señal de aprobación con la mano',
    learningName: 'gesto de OK',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🤘': {
    canonicalName: 'mano haciendo el signo de cuernos',
    learningName: 'gesto de los cuernos',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🤙': {
    canonicalName: 'mano haciendo el gesto de llamar',
    learningName: 'gesto de llamar',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🫵': {
    canonicalName: 'dedo índice apuntándote a ti',
    learningName: 'dedo apuntando hacia ti',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '💁‍♀️': {
    canonicalName: 'empleada de mostrador de información',
    learningName: 'mujer dando información',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🍽️': {
    canonicalName: 'cuchillo y tenedor con un plato',
    learningName: 'plato con cuchillo y tenedor',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '⌛️': {
    canonicalName: 'reloj de arena sin tiempo',
    learningName: 'reloj de arena vacío',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '⏳': {
    canonicalName: 'reloj de arena con tiempo',
    learningName: 'reloj de arena en marcha',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '📫': {
    canonicalName: 'buzón cerrado con la bandera levantada',
    learningName: 'buzón cerrado con correo',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '📪': {
    canonicalName: 'buzón cerrado con la bandera bajada',
    learningName: 'buzón cerrado vacío',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '📬': {
    canonicalName: 'buzón abierto con la bandera levantada',
    learningName: 'buzón abierto con correo',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '📭': {
    canonicalName: 'buzón abierto con la bandera bajada',
    learningName: 'buzón abierto vacío',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🔕': {
    canonicalName: 'campana con signo de cancelación',
    learningName: 'campana silenciada',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🔞': {
    canonicalName: 'prohibido para menos de 18 años',
    learningName: 'prohibido para menores de 18 años',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🔃': {
    canonicalName: 'flechas verticales en sentido horario',
    learningName: 'flechas en sentido horario',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍⚕️': {
    canonicalName: 'profesional sanitario mujer',
    learningName: 'profesional de la salud',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🎓': {
    canonicalName: 'estudiante mujer',
    learningName: 'estudiante',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🏫': {
    canonicalName: 'docente mujer',
    learningName: 'profesora',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍⚖️': {
    canonicalName: 'fiscal mujer',
    learningName: 'jueza',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🌾': {
    canonicalName: 'profesional de la agricultura mujer',
    learningName: 'agricultora',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🍳': {
    canonicalName: 'chef mujer',
    learningName: 'cocinera',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🔧': {
    canonicalName: 'profesional de la mecánica mujer',
    learningName: 'mecánica',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🏭': {
    canonicalName: 'profesional industrial mujer',
    learningName: 'trabajadora de fábrica',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍💼': {
    canonicalName: 'oficinista mujer',
    learningName: 'oficinista',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🔬': {
    canonicalName: 'profesional de la ciencia mujer',
    learningName: 'científica',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍💻': {
    canonicalName: 'profesional de la tecnología mujer',
    learningName: 'programadora',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🎤': {
    canonicalName: 'cantante mujer',
    learningName: 'cantante',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🎨': {
    canonicalName: 'artista mujer',
    learningName: 'artista',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍✈️': {
    canonicalName: 'piloto mujer',
    learningName: 'piloto',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🚀': {
    canonicalName: 'astronauta mujer',
    learningName: 'astronauta',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👮‍♀️': {
    canonicalName: 'agente de policía mujer',
    learningName: 'policía',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '🕵️‍♀️': {
    canonicalName: 'detective mujer',
    learningName: 'detective',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '💂‍♀️': {
    canonicalName: 'guardia mujer',
    learningName: 'guardia',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👷‍♀️': {
    canonicalName: 'profesional de la construcción mujer',
    learningName: 'trabajadora de la construcción',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🦼‍➡️': {
    canonicalName: 'mujer en silla de ruedas eléctrica hacia la derecha',
    learningName: 'silla de ruedas eléctrica a la derecha',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
  '👩‍🦽‍➡️': {
    canonicalName: 'mujer en silla de ruedas manual hacia la derecha',
    learningName: 'silla de ruedas manual a la derecha',
    audioStatus: 'ready',
    reason: 'learner-clarity',
  },
};

/** Only return content whose exact learner-facing recording has passed QA. */
export function getReadySpanishLearningName(emoji: string): string | null {
  const override = SPANISH_LEARNING_CONTENT_OVERRIDES[emoji];
  return override?.audioStatus === 'ready' ? override.learningName : null;
}
