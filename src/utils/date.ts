import { Timestamp } from "../../pb/google/protobuf/timestamp";

export const convertTimestampToDate = (timestamp: Timestamp | undefined): string => {
    // return kalau timestamp nya kosong
    if (!timestamp){
      return '';
    }

    const dateMember = new Date(Number(timestamp?.seconds)* 1000)
    return dateMember.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}