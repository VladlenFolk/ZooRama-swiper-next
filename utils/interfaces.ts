export type Status = "words" | "nouns" | "verbs";

export interface Data {
  id: number;
  content: string;
  status: Status;
}

export type Card = {
  id: number;
  img: string;
};
