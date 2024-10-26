import { get, readable, writable, readonly } from 'svelte/store';
import {db, timenow} from '$lib/app';
import { DateTime } from "luxon";
import {query, collection, onSnapshot, orderBy, addDoc,deleteDoc, doc, getDoc, setDoc, updateDoc, getDocs, QueryConstraint,where, documentId, limit} from 'firebase/firestore';
import type { CategoriesType } from './types/categories';
import { CategoriesSchema } from './types/categories';
import swal from 'sweetalert';


export const categoriesIcon = "tdesign:icon";
export const subparts:string[]  = [];
export const categoriesStore = ( ...queryConstraints: QueryConstraint[]) => readable<CategoriesType[]>([], function start(set) {
        
        const subcolPath = "";
        if(subcolPath.includes("//")){
            return;
        }
        if( queryConstraints.length == 0){
            queryConstraints.push(orderBy('added','desc'));
        }
        
        const unsub = onSnapshot(query(collection(db, subcolPath+"categories"), ...queryConstraints),async (querySnapshot) => {
            const tmp:CategoriesType[] = [];
            categories_byId = new Map<string, CategoriesType>();
            
            querySnapshot.forEach((doc) => {
                
                const tempcategories = CategoriesFromData(doc.id, doc.data());

                if(tempcategories == undefined){
                    return;
                }
                
                const element =tempcategories;

                tmp.push(element);
                
                categories_byId.set(doc.id,element);
                
            });
            set(tmp);
        
            
        },function(error) {
            console.log("Error loading categories", error);
            if(error.code == "permission-denied"){
                console.log("Error", "No tiene permisos para ver Categorías", error);
                return;
            }
        });
    
	return function stop() {
        unsub();
	};
});
export const categoriesByIdStore = ( docId:string) => readable<CategoriesType|undefined>(undefined, function start(set) {
        
    const subcolPath = "";
    const unsub = onSnapshot(doc(db, subcolPath+"categories",docId),async (doc) => {
        
        if(doc.exists() == false || doc.data() == undefined){
            set(undefined);
            return;
        }
        
        const tempcategories = CategoriesFromData(doc.id, doc.data());
        if(tempcategories == undefined){
            return;
        }
        
        const element =tempcategories;
        set(element);
    
        
    },function(error) {
        console.log("Error loading categories", error);
        if(error.code == "permission-denied"){
            console.log("Error", "No tiene permisos para ver Categorías", error);
            return;
        }
    });

return function stop() {
    unsub();
};
});

export const categoriesGetAll = async ( ...queryConstraints: QueryConstraint[]) => {
    const subcolPath = "";
    if( queryConstraints.length == 0){
        queryConstraints.push(orderBy('added','desc'));
    }
    const querySnapshot = await getDocs(query(collection(db, subcolPath+"categories"), ...queryConstraints));
    const tmp:CategoriesType[] = [];
    for(let i = 0; i < querySnapshot.docs.length; i++){
        const doc = querySnapshot.docs[i];
        
        const tempcategories = CategoriesFromData(doc.id, doc.data());

        if(tempcategories == undefined){
            continue;
        }

        tmp.push(tempcategories);
    }
    return tmp;
}

interface IIndexable {
    [key: string]: any;
}

export const categoriesGetNextOfField = async ( field:string) => {
    const subcolPath = "";
    const querySnapshot = await getDocs(query(collection(db, subcolPath+"categories"), orderBy(field, "desc"), limit(2)));
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

export const categoriesGetById = async ( id:string) => {
    const subcolPath = "";
    const docRes = await getDoc(doc(db, subcolPath+"categories/"+id));
    if(!docRes.exists())
        return;
    
    return CategoriesFromData(docRes.id, docRes.data());
}

export const CategoriesFromData = (id:string, data:any):CategoriesType|undefined => {
    const tempcategories = data ?? {};
        tempcategories.id = id;
        if(tempcategories.added != undefined && typeof tempcategories.added.toDate === 'function'){
            tempcategories.addedTime = DateTime.fromJSDate(tempcategories.added.toDate()).setLocale("es-mx");
        }
        

        const parseRes = CategoriesSchema.passthrough().safeParse(tempcategories);
        if(parseRes.success == false){
            console.log("error parseando",id,parseRes.error);
            return;
        }

        return parseRes.data;
}

export function categoriesValuesMapById(){ //
    const data = writable<Map<string,CategoriesType>>(new Map());
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
        const tmp = new Map<string,CategoriesType>(existing);
        for(let i = 0; i < toLoadArray.length; i+=25){
            toLoadBatches.push(toLoadArray.slice(i,i+25));
        }
        for(let i = 0; i < toLoadBatches.length; i++){
                try{
                const querySnapshot = await getDocs(query(collection(db, subcolPath+"categories"), where( documentId(), "in", toLoadBatches[i])));
                for(let i = 0; i < querySnapshot.docs.length; i++){
                    const doc = querySnapshot.docs[i];
                    
                    const tempcategories = CategoriesFromData(doc.id, doc.data());

                    if(tempcategories == undefined){
                        continue;
                    }

                    tmp.set(doc.id,tempcategories);
                }
            }catch(e){
                console.error("Error loading Categorías", e);
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
export let categories_byId:Map<string, CategoriesType> = new Map<string, CategoriesType>();
export const addCategories = async ( values:CategoriesType, docId?:string) =>{
    const subcolPath = "";
    values.added = timenow;
    if(docId != undefined && docId != ""){
        await setDoc(doc(db, subcolPath+ "categories/"+ docId), values, { merge: true });
        return docId;
    }
    const docRef = await addDoc(collection(db, subcolPath+ "categories"), values);
    return docRef.id;
}
export const updateCategories = ( docId:string, values:any) =>{
    const subcolPath = "";
    // values.modified = timenow;
    return updateDoc(doc(db, subcolPath+ "categories",docId), values);
}
export const deleteCategories = ( id:string|undefined)=> {
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
                    deleteDoc(doc(db,subcolPath + "categories",id));
                  //Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            });
    
};

export const duplicateCategories = ( id:string|undefined)=> {
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
                    const basedoc = await getDoc(doc(db,subcolPath +  "categories",id));
                    if(basedoc.exists()){
                        addDoc(collection(db,subcolPath +  "categories"), basedoc.data());
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