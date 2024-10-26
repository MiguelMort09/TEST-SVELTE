import { get, readable, writable, readonly } from 'svelte/store';
import {db, timenow} from '$lib/app';
import { DateTime } from "luxon";
import {query, collection, onSnapshot, orderBy, addDoc,deleteDoc, doc, getDoc, setDoc, updateDoc, getDocs, QueryConstraint,where, documentId, limit} from 'firebase/firestore';
import type { TasksType } from './types/tasks';
import { TasksSchema } from './types/tasks';
import swal from 'sweetalert';
import {categoriesValuesMapById} from "$lib/controls/categories"
import {subcategoriesValuesMapById} from "$lib/controls/subcategories"


export const tasksIcon = "tdesign:icon";
export const subparts:string[]  = [];
export const tasksStore = ( ...queryConstraints: QueryConstraint[]) => readable<TasksType[]>([], function start(set) {
        
        const subcolPath = "";
        if(subcolPath.includes("//")){
            return;
        }
        if( queryConstraints.length == 0){
            queryConstraints.push(orderBy('added','desc'));
        }
        
        const unsub = onSnapshot(query(collection(db, subcolPath+"tasks"), ...queryConstraints),async (querySnapshot) => {
            const tmp:TasksType[] = [];
            tasks_byId = new Map<string, TasksType>();
            
            querySnapshot.forEach((doc) => {
                
                const temptasks = TasksFromData(doc.id, doc.data());

                if(temptasks == undefined){
                    return;
                }
                
                const element =temptasks;

                tmp.push(element);
                
                tasks_byId.set(doc.id,element);
                
            });
            set(tmp);
        
            
        },function(error) {
            console.log("Error loading tasks", error);
            if(error.code == "permission-denied"){
                console.log("Error", "No tiene permisos para ver Tareas", error);
                return;
            }
        });
    
	return function stop() {
        unsub();
	};
});
export const tasksByIdStore = ( docId:string) => readable<TasksType|undefined>(undefined, function start(set) {
        
    const subcolPath = "";
    const unsub = onSnapshot(doc(db, subcolPath+"tasks",docId),async (doc) => {
        
        if(doc.exists() == false || doc.data() == undefined){
            set(undefined);
            return;
        }
        
        const temptasks = TasksFromData(doc.id, doc.data());
        if(temptasks == undefined){
            return;
        }
        
        const element =temptasks;
        set(element);
    
        
    },function(error) {
        console.log("Error loading tasks", error);
        if(error.code == "permission-denied"){
            console.log("Error", "No tiene permisos para ver Tareas", error);
            return;
        }
    });

return function stop() {
    unsub();
};
});

export const tasksGetAll = async ( ...queryConstraints: QueryConstraint[]) => {
    const subcolPath = "";
    if( queryConstraints.length == 0){
        queryConstraints.push(orderBy('added','desc'));
    }
    const querySnapshot = await getDocs(query(collection(db, subcolPath+"tasks"), ...queryConstraints));
    const tmp:TasksType[] = [];
    for(let i = 0; i < querySnapshot.docs.length; i++){
        const doc = querySnapshot.docs[i];
        
        const temptasks = TasksFromData(doc.id, doc.data());

        if(temptasks == undefined){
            continue;
        }

        tmp.push(temptasks);
    }
    return tmp;
}

interface IIndexable {
    [key: string]: any;
}

export const tasksGetNextOfField = async ( field:string) => {
    const subcolPath = "";
    const querySnapshot = await getDocs(query(collection(db, subcolPath+"tasks"), orderBy(field, "desc"), limit(2)));
    if(querySnapshot.docs.length > 0){
        let max = (querySnapshot.docs[0].data() as IIndexable)[field];
        if(max != undefined && !isNaN(max)){
          return max + 1;
        }
      }else{
        console.log("No data autoincrement");
      }
      return 1;
}

export const tasksGetById = async ( id:string) => {
    const subcolPath = "";
    const docRes = await getDoc(doc(db, subcolPath+"tasks/"+id));
    if(!docRes.exists())
        return;
    
    return TasksFromData(docRes.id, docRes.data());
}

export const TasksFromData = (id:string, data:any):TasksType|undefined => {
    const temptasks = data ?? {};
        temptasks.id = id;
        if(temptasks.added != undefined && typeof temptasks.added.toDate === 'function'){
            temptasks.addedTime = DateTime.fromJSDate(temptasks.added.toDate()).setLocale("es-mx");
        }
        			
				if(temptasks.dueDate != undefined){
					if( typeof temptasks.dueDate === 'string' || temptasks.dueDate instanceof String){
						temptasks.dueDateTime = DateTime.fromISO(temptasks.dueDate as string);
					}else if(temptasks.dueDate instanceof Date){
                        temptasks.dueDateTime = DateTime.fromJSDate(temptasks.dueDate);
                    } else if(temptasks.dueDate == timenow){
						temptasks.dueDateTime = DateTime.local().setLocale("es-mx");
						temptasks.dueDate = temptasks.dueDateTime.toJSDate();
					} else	{
						temptasks.dueDateTime = DateTime.fromJSDate(temptasks.dueDate.toDate());
						temptasks.dueDate = temptasks.dueDateTime.toJSDate();
					}
				}


        const parseRes = TasksSchema.passthrough().safeParse(temptasks);
        if(parseRes.success == false){
            console.log("error parseando",id,parseRes.error);
            return;
        }

        return parseRes.data;
}

export function tasksValuesMapById(){ //
    const data = writable<Map<string,TasksType>>(new Map());
    const toLoad = new Set<string>();
    function toQueue(id:string|undefined ){
        if(id != undefined && id != "" && !toLoad.has(id)){
            toLoad.add(id);
        }
    }
    async function load(){
        if(toLoad.size == 0){
            return;
        }
        const subcolPath =  "";//"";

        const toLoadArray = Array.from(toLoad);
        const toLoadBatches:string[][] = [];
        const existing = get(data);
        const tmp = new Map<string,TasksType>(existing);
        for(let i = 0; i < toLoadArray.length; i+=25){
            toLoadBatches.push(toLoadArray.slice(i,i+25));
        }
        for(let i = 0; i < toLoadBatches.length; i++){
                try{
                const querySnapshot = await getDocs(query(collection(db, subcolPath+"tasks"), where( documentId(), "in", toLoadBatches[i])));
                for(let i = 0; i < querySnapshot.docs.length; i++){
                    const doc = querySnapshot.docs[i];
                    
                    const temptasks = TasksFromData(doc.id, doc.data());

                    if(temptasks == undefined){
                        continue;
                    }

                    tmp.set(doc.id,temptasks);
                }
            }catch(e){
                console.error("Error loading Tareas", e);
            }
        }
        data.set(tmp);
        toLoad.clear();

    }
    return {
        ...readonly(data),
        toQueue,
        load
    }


}
export let tasks_byId:Map<string, TasksType> = new Map<string, TasksType>();
export const addTasks = async ( values:TasksType, docId?:string) =>{
    const subcolPath = "";
    values.added = timenow;
    if(docId != undefined && docId != ""){
        await setDoc(doc(db, subcolPath+ "tasks/"+ docId), values, { merge: true });
        return docId;
    }
    const docRef = await addDoc(collection(db, subcolPath+ "tasks"), values);
    return docRef.id;
}
export const updateTasks = ( docId:string, values:any) =>{
    const subcolPath = "";
    // values.modified = timenow;
    return updateDoc(doc(db, subcolPath+ "tasks",docId), values);
}
export const deleteTasks = ( id:string|undefined)=> {
    if(id == undefined || id == "")
        return;
    const subcolPath = "";
    swal({
                title: "¿Esta seguro?",
                text: "Desea eliminar este registro",
                icon: "warning",
                buttons:["Cancelar", "Si, borrarlo!"]
              }).then(function (result) {
                if (result != null) {
                    deleteDoc(doc(db,subcolPath + "tasks",id));
                  //Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            });
    
};

export const duplicateTasks = ( id:string|undefined)=> {
    if(id == undefined || id == "")
        return;
    const subcolPath = "";
    swal({
                title: "¿Esta seguro?",
                text: "Desea duplicar este registro",
                icon: "info",
                buttons:["Cancelar", "Si, duplicar!"]
              }).then(async function (result) {
                if (result != null) {
                    const basedoc = await getDoc(doc(db,subcolPath +  "tasks",id));
                    if(basedoc.exists()){
                        addDoc(collection(db,subcolPath +  "tasks"), basedoc.data());
                    }
                }
            });
    
};

function subcolToPath(subcol:string[]|undefined) {
    let subcolPath = "";
    if(subcol != undefined && subparts.length > 0){
        for (let s = 0; s < subcol.length; s += 2) {
            const element = subcol[s];
            if(subparts.indexOf(element) > -1){
                subcolPath += "/"+element+"/"+subcol[s+1];
            }
        }
        if(subcolPath != ""){
            subcolPath += "/";
        }
        
    }
    return subcolPath;
}