export type RestaurantOperatingHours = {
  day: string;
  opens: string;
  closes: string;
};

export type RestaurantStatus = {
  isOpen: boolean;
  deliveryAvailable: boolean;
  reservationsAvailable: boolean;
  currentLabel: string;
  nextChangeLabel: string;
  deliveryEstimateMinutes: {
    min: number;
    max: number;
  };
};

type WeekdayShort = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

const weekdayIndexes: Record<WeekdayShort, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Sao_Paulo",
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23"
});

export const restaurantTimeZone = "America/Sao_Paulo";

export const restaurantOperatingSchedule = [
  { day: "Domingo", opens: "12:00", closes: "16:00" },
  null,
  { day: "Terça-feira", opens: "18:00", closes: "22:30" },
  { day: "Quarta-feira", opens: "18:00", closes: "22:30" },
  { day: "Quinta-feira", opens: "18:00", closes: "22:30" },
  { day: "Sexta-feira", opens: "18:00", closes: "23:30" },
  { day: "Sábado", opens: "12:00", closes: "23:30" }
] as const satisfies ReadonlyArray<RestaurantOperatingHours | null>;

export function formatRestaurantOperatingSchedule(): string {
  return "Terça a quinta, 18:00 às 22:30. Sexta, 18:00 às 23:30. Sábado, 12:00 às 23:30. Domingo, 12:00 às 16:00. Segunda fechado.";
}

export function getReservationDateValidationMessage(value: string | Date, now = new Date()): string | null {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Informe uma data e horário válidos.";
  }

  if (date.getTime() <= now.getTime()) {
    return "Escolha uma data e horário futuros.";
  }

  const parts = getZonedDateTimeParts(date);

  if (!parts) {
    return "Informe uma data e horário válidos.";
  }

  const operatingHours = restaurantOperatingSchedule[parts.dayIndex];

  if (!operatingHours) {
    return "O restaurante não abre neste dia.";
  }

  const opensAt = timeToMinutes(operatingHours.opens);
  const closesAt = timeToMinutes(operatingHours.closes);

  if (parts.minutes < opensAt || parts.minutes >= closesAt) {
    return `Reservas neste dia são permitidas das ${operatingHours.opens} às ${operatingHours.closes}.`;
  }

  return null;
}

export function isReservationDateAllowed(value: string | Date, now = new Date()): boolean {
  return getReservationDateValidationMessage(value, now) === null;
}

export function getRestaurantStatus(now = new Date()): RestaurantStatus {
  const parts = getZonedDateTimeParts(now);
  const fallback = {
    isOpen: false,
    deliveryAvailable: false,
    reservationsAvailable: false,
    currentLabel: "Status indisponível",
    nextChangeLabel: "Consulte os horários de atendimento.",
    deliveryEstimateMinutes: { min: 35, max: 45 }
  };

  if (!parts) {
    return fallback;
  }

  const operatingHours = restaurantOperatingSchedule[parts.dayIndex];

  if (operatingHours) {
    const opensAt = timeToMinutes(operatingHours.opens);
    const closesAt = timeToMinutes(operatingHours.closes);
    const isOpen = parts.minutes >= opensAt && parts.minutes < closesAt;

    if (isOpen) {
      return {
        isOpen: true,
        deliveryAvailable: true,
        reservationsAvailable: true,
        currentLabel: `Aberto até ${operatingHours.closes}`,
        nextChangeLabel: `Pedidos e reservas disponíveis até ${operatingHours.closes}.`,
        deliveryEstimateMinutes: { min: 35, max: 45 }
      };
    }

    if (parts.minutes < opensAt) {
      return {
        isOpen: false,
        deliveryAvailable: false,
        reservationsAvailable: false,
        currentLabel: "Fechado agora",
        nextChangeLabel: `Reabre hoje às ${operatingHours.opens}.`,
        deliveryEstimateMinutes: { min: 35, max: 45 }
      };
    }
  }

  const nextOpening = getNextOpening(parts.dayIndex);

  return {
    isOpen: false,
    deliveryAvailable: false,
    reservationsAvailable: false,
    currentLabel: "Fechado agora",
    nextChangeLabel: nextOpening ? `Reabre ${nextOpening.day.toLowerCase()} às ${nextOpening.opens}.` : "Consulte os horários de atendimento.",
    deliveryEstimateMinutes: { min: 35, max: 45 }
  };
}

function getZonedDateTimeParts(date: Date): { dayIndex: number; minutes: number } | null {
  const parts = dateTimeFormatter.formatToParts(date);
  const weekday = getPartValue(parts, "weekday");
  const hour = Number(getPartValue(parts, "hour"));
  const minute = Number(getPartValue(parts, "minute"));

  if (!isWeekdayShort(weekday) || Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  return {
    dayIndex: weekdayIndexes[weekday],
    minutes: hour * 60 + minute
  };
}

function getPartValue(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes): string {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function isWeekdayShort(value: string): value is WeekdayShort {
  return value in weekdayIndexes;
}

function timeToMinutes(value: string): number {
  const [hour = "0", minute = "0"] = value.split(":");
  return Number(hour) * 60 + Number(minute);
}

function getNextOpening(dayIndex: number): RestaurantOperatingHours | null {
  for (let offset = 1; offset <= 7; offset += 1) {
    const nextIndex = (dayIndex + offset) % restaurantOperatingSchedule.length;
    const operatingHours = restaurantOperatingSchedule[nextIndex];

    if (operatingHours) {
      return operatingHours;
    }
  }

  return null;
}
