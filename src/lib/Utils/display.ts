import { Timestamp } from "firebase/firestore";
import { DateTime } from "luxon";

export function timeToAgo(timeStr:string|Timestamp|Date|undefined){
    if(timeStr == undefined || timeStr == "" || timeStr == null){
        return "";
    }
    if(timeStr instanceof Timestamp){
        return DateTime.fromJSDate(timeStr.toDate()).setLocale("es-mx").toRelative({ unit: "days" });
    }
    if(timeStr instanceof Date){
        return DateTime.fromJSDate(timeStr).setLocale("es-mx").toRelative({ unit: "days" });
    }
    return DateTime.fromISO(timeStr).setLocale("es-mx").toRelative({ unit: "days" });
}
export function timeFormated(timeStr:string|Timestamp|Date|undefined, justDate = true){
    let format = DateTime.DATE_MED_WITH_WEEKDAY;
    if(!justDate){
        format = DateTime.DATETIME_MED_WITH_WEEKDAY;
    }
    if(timeStr == undefined || timeStr == "" || timeStr == null){
        return "";
    }
    if(timeStr instanceof Timestamp){
        return DateTime.fromJSDate(timeStr.toDate()).setLocale("es-mx").toLocaleString(format);
    }
    if(timeStr instanceof Date){
        return DateTime.fromJSDate(timeStr).setLocale("es-mx").toLocaleString(format);
    }
    return DateTime.fromISO(timeStr).setLocale("es-mx").toLocaleString(format);
}