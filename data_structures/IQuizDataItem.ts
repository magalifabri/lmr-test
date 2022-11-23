import IAnswer from "./IAnswer";

export default interface IQuizDataItem {
    question: string;
    time_limit_s: number;
    answers: IAnswer[];
    uid: string;
}
