export type SignalWeights = Record<string, number>

export interface OnboardingOption {
  id: string
  text: string
  signal: SignalWeights
}

export interface OnboardingQuestion {
  id: string
  type: 'scenario' | 'dilemma' | 'tradeoff' | 'story'
  prompt: string
  subtext?: string
  options: OnboardingOption[]
  // For tradeoff type: left/right labels
  leftLabel?: string
  rightLabel?: string
}

export interface OnboardingSession {
  id: number
  title: string
  description: string
  insightHint: string
  questions: OnboardingQuestion[]
}

export const ONBOARDING_SESSIONS: OnboardingSession[] = [
  {
    id: 1,
    title: 'Образы и реакции',
    description: 'Несколько жизненных сценариев. Нет правильных ответов — только твои.',
    insightHint: 'Из твоих ответов начинает проступать паттерн того, как ты восстанавливаешься и что тебе нужно.',
    questions: [
      {
        id: 's1_q1',
        type: 'scenario',
        prompt: 'Пятница вечер, тяжёлая неделя позади. Никаких обязательств. Что ты выберешь?',
        options: [
          {
            id: 'a',
            text: 'Позвоню другу — хочу поговорить',
            signal: { social: 1.0, activation: 0.8, expressionNeed: 0.9 },
          },
          {
            id: 'b',
            text: 'Включу любимый сериал в тишине',
            signal: { deactivation: 0.9, introvert: 0.8, soloRecharge: 1.0 },
          },
          {
            id: 'c',
            text: 'Пойду на тренировку или долгую прогулку',
            signal: { somatic: 1.0, activation: 0.7, bodyOriented: 0.9 },
          },
          {
            id: 'd',
            text: 'Залипну в телефон, чтобы не думать',
            signal: { avoidance: 0.9, suppression: 0.8, numbing: 0.7 },
          },
        ],
      },
      {
        id: 's1_q2',
        type: 'scenario',
        prompt: 'Близкий человек расстроен, но говорит "всё нормально". Что ты делаешь?',
        options: [
          {
            id: 'a',
            text: 'Мягко спрошу ещё раз — я слышу, что что-то не так',
            signal: { empathicAccuracy: 0.9, assertive: 0.6, directCare: 0.8 },
          },
          {
            id: 'b',
            text: 'Дам пространство — когда будет готов(а), расскажет',
            signal: { autonomyRespect: 1.0, avoidance: 0.3, deactivation: 0.6 },
          },
          {
            id: 'c',
            text: 'Начну что-то делать вместе — действие лучше слов',
            signal: { somatic: 0.8, indirect: 0.7, practicalCare: 0.9 },
          },
          {
            id: 'd',
            text: 'Буду переживать внутри, не зная как подступиться',
            signal: { anxiety: 0.9, flooding: 0.7, ruminiation: 0.8 },
          },
        ],
      },
      {
        id: 's1_q3',
        type: 'scenario',
        prompt: 'Тебе предлагают интересный проект — но сроки жёсткие и придётся пожертвовать личным временем на месяц. Ты...',
        options: [
          {
            id: 'a',
            text: 'Соглашусь — вызов интересен, вытяну',
            signal: { achievement: 1.0, activation: 0.9, stimulation: 0.8 },
          },
          {
            id: 'b',
            text: 'Попрошу изменить условия или сроки',
            signal: { assertive: 1.0, autonomy: 0.9, boundaries: 0.8 },
          },
          {
            id: 'c',
            text: 'Откажусь — мой ресурс сейчас важнее',
            signal: { security: 0.9, deactivation: 0.7, selfCare: 1.0 },
          },
          {
            id: 'd',
            text: 'Соглашусь, но буду беспокоиться о том, что упущу',
            signal: { anxiety: 0.9, conformity: 0.6, appeasement: 0.7 },
          },
        ],
      },
      {
        id: 's1_q4',
        type: 'scenario',
        prompt: 'В компании незнакомых людей разговор зашёл о теме, в которой у тебя есть сильное мнение, но оно идёт вразрез с большинством. Ты...',
        options: [
          {
            id: 'a',
            text: 'Скажу прямо — несогласие не повод молчать',
            signal: { direct: 1.0, assertive: 0.9, compete: 0.6 },
          },
          {
            id: 'b',
            text: 'Задам вопрос, чтобы понять их точку зрения глубже',
            signal: { collaborate: 1.0, curiosity: 0.9, universalism: 0.7 },
          },
          {
            id: 'c',
            text: 'Промолчу — не та обстановка для дискуссии',
            signal: { avoid: 0.8, indirect: 0.7, conformity: 0.6 },
          },
          {
            id: 'd',
            text: 'Аккуратно обозначу иную перспективу, без конфронтации',
            signal: { assertive: 0.7, indirect: 0.5, accommodate: 0.5 },
          },
        ],
      },
      {
        id: 's1_q5',
        type: 'scenario',
        prompt: 'Ты узнаёшь, что близкий человек сказал о тебе что-то несправедливое за твоей спиной. Первая реакция?',
        options: [
          {
            id: 'a',
            text: 'Поговорю с ним напрямую — нужно прояснить',
            signal: { direct: 1.0, assertive: 0.9, repair: 0.8 },
          },
          {
            id: 'b',
            text: 'Дистанцируюсь — мне нужно переварить прежде чем говорить',
            signal: { deactivation: 0.9, rumination: 0.6, avoidant: 0.5 },
          },
          {
            id: 'c',
            text: 'Обижусь и долго буду прокручивать в голове',
            signal: { anxious: 0.8, rumination: 1.0, flooding: 0.7 },
          },
          {
            id: 'd',
            text: 'Постараюсь понять, что за этим стоит с его стороны',
            signal: { universalism: 0.9, collaborate: 0.8, benevolence: 0.7 },
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Моральные дилеммы',
    description: 'Четыре ситуации без правильного ответа. Важно не что правильно — а что важно для тебя.',
    insightHint: 'Твои выборы в этих дилеммах показывают иерархию ценностей, которую трудно увидеть в обычной жизни.',
    questions: [
      {
        id: 's2_q1',
        type: 'dilemma',
        prompt: 'Твой лучший друг совершил поступок, который причинил вред третьему человеку. Ты единственный, кто знает. Пострадавший не в курсе.',
        subtext: 'Лояльность к близким vs справедливость по отношению к незнакомым.',
        options: [
          {
            id: 'a',
            text: 'Скажу другу, что он должен сам признаться — иначе я сообщу',
            signal: { universalism: 0.9, assertive: 0.8, justice: 1.0 },
          },
          {
            id: 'b',
            text: 'Поддержу друга, но помогу ему загладить вину косвенно',
            signal: { benevolence: 0.9, accommodate: 0.7, loyalty: 0.8 },
          },
          {
            id: 'c',
            text: 'Это не моё дело — пусть сам разбирается',
            signal: { autonomy: 1.0, avoid: 0.8, selfDirection: 0.9 },
          },
          {
            id: 'd',
            text: 'Сообщу пострадавшему — правда важнее дружбы',
            signal: { universalism: 1.0, compete: 0.6, justice: 0.9 },
          },
        ],
      },
      {
        id: 's2_q2',
        type: 'dilemma',
        prompt: 'Тебе предлагают высокооплачиваемую работу, но компания работает в индустрии, которая противоречит твоим ценностям (не нелегально, но этически сомнительно). Деньги позволят решить реальные проблемы близких.',
        subtext: 'Личная этика vs забота о близких.',
        options: [
          {
            id: 'a',
            text: 'Откажусь — с этим не смогу смотреть на себя в зеркало',
            signal: { selfDirection: 1.0, spirit: 0.9, values: 1.0 },
          },
          {
            id: 'b',
            text: 'Приму, поработаю год — практические нужды реальны',
            signal: { benevolence: 0.9, security: 0.8, pragmatism: 1.0 },
          },
          {
            id: 'c',
            text: 'Попробую изменить что-то изнутри, работая там',
            signal: { achievement: 0.8, universalism: 0.7, stimulation: 0.6 },
          },
          {
            id: 'd',
            text: 'Долго буду взвешивать — это настоящая дилемма для меня',
            signal: { rumination: 0.9, universalism: 0.6, anxiety: 0.5 },
          },
        ],
      },
      {
        id: 's2_q3',
        type: 'dilemma',
        prompt: 'В команде ты замечаешь, что коллега регулярно приписывает себе чужие идеи. Один из пострадавших — твой друг. Руководство не замечает.',
        subtext: 'Справедливость vs спокойствие в коллективе.',
        options: [
          {
            id: 'a',
            text: 'Поговорю с коллегой напрямую — пусть знает, что я вижу',
            signal: { assertive: 1.0, direct: 0.9, compete: 0.7 },
          },
          {
            id: 'b',
            text: 'Поддержу друга в том, чтобы он сам поднял вопрос',
            signal: { benevolence: 0.9, collaborate: 0.8, indirect: 0.6 },
          },
          {
            id: 'c',
            text: 'Сообщу руководству — это системная проблема',
            signal: { universalism: 0.8, assertive: 0.7, power: 0.5 },
          },
          {
            id: 'd',
            text: 'Не буду вмешиваться — это не моё',
            signal: { autonomy: 0.8, avoid: 0.9, conformity: 0.5 },
          },
        ],
      },
      {
        id: 's2_q4',
        type: 'dilemma',
        prompt: 'Ты случайно узнал(а) информацию, которая очень важна для твоего партнёра, но которую тебе доверили под условием конфиденциальности. Партнёр мог бы принять другое решение, зная это.',
        subtext: 'Честность в отношениях vs данное слово.',
        options: [
          {
            id: 'a',
            text: 'Скажу партнёру — в отношениях не должно быть скрытого',
            signal: { direct: 1.0, security: 0.8, intimate: 0.9 },
          },
          {
            id: 'b',
            text: 'Не скажу, но постараюсь помочь партнёру прийти к информации другим путём',
            signal: { benevolence: 1.0, indirect: 0.8, accommodate: 0.7 },
          },
          {
            id: 'c',
            text: 'Попрошу разрешения у источника поделиться',
            signal: { universalism: 0.9, collaborate: 0.8, assertive: 0.6 },
          },
          {
            id: 'd',
            text: 'Сохраню тайну — данное слово не отменяется',
            signal: { conformity: 0.9, tradition: 0.8, loyalty: 1.0 },
          },
        ],
      },
    ],
  },
  {
    id: 3,
    title: 'Жизненные трейдоффы',
    description: 'Пять выборов между двумя равно-ценными вещами. Никогда не бывает "и то, и другое".',
    insightHint: 'Эта сессия показывает, что ты реально приоритизируешь, когда надо выбирать.',
    questions: [
      {
        id: 's3_q1',
        type: 'tradeoff',
        prompt: 'Если бы пришлось выбрать одно:',
        leftLabel: 'Стабильная работа с хорошей командой',
        rightLabel: 'Рискованный, но вдохновляющий проект в одиночку',
        options: [
          { id: 'left', text: 'Стабильная работа с хорошей командой', signal: { security: 1.0, benevolence: 0.8, conformity: 0.6 } },
          { id: 'center_left', text: 'Скорее стабильность', signal: { security: 0.7, stimulation: 0.3 } },
          { id: 'center_right', text: 'Скорее риск', signal: { stimulation: 0.7, achievement: 0.6 } },
          { id: 'right', text: 'Рискованный вдохновляющий проект', signal: { stimulation: 1.0, achievement: 0.9, selfDirection: 0.8 } },
        ],
      },
      {
        id: 's3_q2',
        type: 'tradeoff',
        prompt: 'В отношениях что важнее:',
        leftLabel: 'Глубокая эмоциональная близость',
        rightLabel: 'Уважение к независимости друг друга',
        options: [
          { id: 'left', text: 'Глубокая близость', signal: { anxious: 0.5, intimate: 1.0, benevolence: 0.8 } },
          { id: 'center_left', text: 'Скорее близость', signal: { intimate: 0.7, autonomy: 0.3 } },
          { id: 'center_right', text: 'Скорее независимость', signal: { autonomy: 0.7, avoidant: 0.3 } },
          { id: 'right', text: 'Независимость', signal: { autonomy: 1.0, avoidant: 0.6, selfDirection: 0.9 } },
        ],
      },
      {
        id: 's3_q3',
        type: 'tradeoff',
        prompt: 'Если выбирать между:',
        leftLabel: 'Знать правду, даже если она болезненна',
        rightLabel: 'Оставаться в неведении, если это сохраняет покой',
        options: [
          { id: 'left', text: 'Знать правду', signal: { direct: 1.0, selfDirection: 0.9, stimulation: 0.6 } },
          { id: 'center_left', text: 'Скорее правда', signal: { direct: 0.7, security: 0.3 } },
          { id: 'center_right', text: 'Скорее покой', signal: { security: 0.7, suppression: 0.4 } },
          { id: 'right', text: 'Сохранить покой', signal: { security: 1.0, suppression: 0.7, avoidance: 0.6 } },
        ],
      },
      {
        id: 's3_q4',
        type: 'tradeoff',
        prompt: 'Что ближе к тому, как ты хочешь жить:',
        leftLabel: 'Насыщенная жизнь с множеством людей и событий',
        rightLabel: 'Тихая жизнь с глубокими связями и пространством',
        options: [
          { id: 'left', text: 'Насыщенная социальная жизнь', signal: { activation: 1.0, stimulation: 0.9, social: 0.8 } },
          { id: 'center_left', text: 'Скорее насыщенная', signal: { activation: 0.6, stimulation: 0.5 } },
          { id: 'center_right', text: 'Скорее тихая', signal: { deactivation: 0.6, introvert: 0.5 } },
          { id: 'right', text: 'Тихая глубокая жизнь', signal: { deactivation: 1.0, introvert: 0.9, spirit: 0.7 } },
        ],
      },
      {
        id: 's3_q5',
        type: 'tradeoff',
        prompt: 'Если бы пришлось выбрать:',
        leftLabel: 'Менять мир вокруг',
        rightLabel: 'Менять себя изнутри',
        options: [
          { id: 'left', text: 'Менять мир', signal: { power: 0.8, universalism: 0.9, achievement: 0.7 } },
          { id: 'center_left', text: 'Скорее мир', signal: { power: 0.6, universalism: 0.6 } },
          { id: 'center_right', text: 'Скорее себя', signal: { growthOriented: 0.6, spirit: 0.5 } },
          { id: 'right', text: 'Менять себя', signal: { growthOriented: 1.0, spirit: 0.9, selfDirection: 0.8 } },
        ],
      },
    ],
  },
  {
    id: 4,
    title: 'Мини-истории',
    description: 'Три короткие истории. Выбери, как бы ты продолжил(а) каждую.',
    insightHint: 'Твои ответы в историях раскрывают паттерны, которые трудно увидеть в прямых вопросах.',
    questions: [
      {
        id: 's4_q1',
        type: 'story',
        prompt: 'Митя работал над проектом три месяца. Когда он наконец представил результат, реакция была сдержанной — "неплохо, но можно было иначе". Что дальше?',
        options: [
          {
            id: 'a',
            text: 'Митя спросит, что конкретно можно улучшить — и переделает',
            signal: { growthOriented: 1.0, collaborate: 0.8, repair: 0.7 },
          },
          {
            id: 'b',
            text: 'Митя расстроится, но не покажет — переживёт внутри',
            signal: { suppression: 0.9, avoidant: 0.7, rumination: 0.8 },
          },
          {
            id: 'c',
            text: 'Митя объяснит свою логику — он уверен в своём подходе',
            signal: { assertive: 0.9, compete: 0.7, selfDirection: 0.8 },
          },
          {
            id: 'd',
            text: 'Митя предложит сделать вместе по-другому — услышал критику',
            signal: { accommodate: 0.8, indirect: 0.6, benevolence: 0.7 },
          },
        ],
      },
      {
        id: 's4_q2',
        type: 'story',
        prompt: 'Соня и её партнёр планировали отпуск вместе. Она хочет активный треккинг, он — расслабленный пляж. Переговоры зашли в тупик.',
        options: [
          {
            id: 'a',
            text: 'Соня предложит два разных отпуска — каждый делает своё',
            signal: { autonomy: 1.0, security: 0.6, selfDirection: 0.8 },
          },
          {
            id: 'b',
            text: 'Соня согласится на пляж — его счастье важнее',
            signal: { accommodate: 1.0, benevolence: 0.9, selfSacrifice: 0.8 },
          },
          {
            id: 'c',
            text: 'Соня будет искать место, где есть и то, и другое',
            signal: { collaborate: 1.0, universalism: 0.7, achievement: 0.6 },
          },
          {
            id: 'd',
            text: 'Соня настоит на своём — она давно этого хотела',
            signal: { compete: 0.9, assertive: 0.8, stimulation: 0.7 },
          },
        ],
      },
      {
        id: 's4_q3',
        type: 'story',
        prompt: 'Артём замечает, что его друг последние недели явно в плохом состоянии, но каждый раз говорит, что у него всё хорошо. Артём видит иначе.',
        options: [
          {
            id: 'a',
            text: 'Артём напрямую скажет: "Я вижу, что тебе тяжело. Я здесь."',
            signal: { empathicAccuracy: 1.0, direct: 0.9, secure: 0.8 },
          },
          {
            id: 'b',
            text: 'Артём будет рядом, но не будет давить — пусть сам скажет',
            signal: { autonomyRespect: 1.0, deactivation: 0.7, secure: 0.6 },
          },
          {
            id: 'c',
            text: 'Артём поговорит с общими друзьями — как они видят ситуацию',
            signal: { indirect: 0.8, benevolence: 0.7, anxious: 0.5 },
          },
          {
            id: 'd',
            text: 'Артём будет переживать и не знать, как подступиться',
            signal: { anxious: 1.0, flooding: 0.8, avoidance: 0.6 },
          },
        ],
      },
    ],
  },
]

export const TOTAL_SESSIONS = ONBOARDING_SESSIONS.length
export const TOTAL_QUESTIONS = ONBOARDING_SESSIONS.reduce(
  (sum, s) => sum + s.questions.length,
  0
)
