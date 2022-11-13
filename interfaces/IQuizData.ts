import IAnswer from "./IAnswer";

export default interface Question {
    question: string;
    time_limit_s: number;
    answers: IAnswer[];
    uid: string;
}
