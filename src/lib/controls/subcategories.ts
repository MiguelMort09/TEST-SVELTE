import { get, readable, writable, readonly } from 'svelte/store';
import {db, timenow} from '$lib/app';
import { DateTime } from "luxon";
import {query, collection, onSnapshot, orderBy, addDoc,deleteDoc, doc, getDoc, setDoc, updateDoc, getDocs, QueryConstraint,where, documentId, limit} from 'firebase/firestore';
import type { SubcategoriesType } from './types/subcategories';
import { SubcategoriesSchema } from './types/subcategories';
import swal from 'sweetalert';
import {categoriesValuesMapById} from "$lib/controls/categories"


export const subcategoriesIcon = "icomoon-free:tree";
export const subparts:string[]  = [];
export const subcategoriesStore = ( ...queryConstraints: QueryConstraint[]) => readable<SubcategoriesType[]>([], function start(set) {
        
        const subcolPath = "";
        if(subcolPath.includes("//")){
            return;
        }
        if( queryConstraints.length == 0){
            queryConstraints.push(orderBy('added','desc'));
        }
        
        const unsub = onSnapshot(query(collection(db, subcolPath+"subcategories"), ...queryConstraints),async (querySnapshot) => {
            const tmp:SubcategoriesType[] = [];
            subcategories_byId = new Map<string, SubcategoriesType>();
            
            querySnapshot.forEach((doc) => {
                
                const tempsubcategories = SubcategoriesFromData(doc.id, doc.data());

                if(tempsubcategories == undefined){
                    return;
                }
                
                const element =tempsubcategories;

                tmp.push(element);
                
                subcategories_byId.set(doc.id,element);
                
            });
            set(tmp);
        
            
        },function(error) {
            console.log("Error loading subcategories", error);
            if(error.code == "permission-denied"){
                console.log("Error", "No tiene permisos para ver Subcategorias", error);
                return;
            }
        });
    
	return function stop() {
        unsub();
	};
});
export const subcategoriesByIdStore = ( docId:string) => readable<SubcategoriesType|undefined>(undefined, function start(set) {
        
    const subcolPath = "";
    const unsub = onSnapshot(doc(db, subcolPath+"subcategories",docId),async (doc) => {
        
        if(doc.exists() == false || doc.data() == undefined){
            set(undefined);
            return;
        }
        
        const tempsubcategories = SubcategoriesFromData(doc.id, doc.data());
        if(tempsubcategories == undefined){
            return;
        }
        
        const element =tempsubcategories;
        set(element);
    
        
    },function(error) {
        console.log("Error loading subcategories", error);
        if(error.code == "permission-denied"){
            console.log("Error", "No tiene permisos para ver Subcategorias", error);
            return;
        }
    });

return function stop() {
    unsub();
};
});

export const subcategoriesGetAll = async ( ...queryConstraints: QueryConstraint[]) => {
    const subcolPath = "";
    if( queryConstraints.length == 0){
        queryConstraints.push(orderBy('added','desc'));
    }
    const querySnapshot = await getDocs(query(collection(db, subcolPath+"subcategories"), ...queryConstraints));
    const tmp:SubcategoriesType[] = [];
    for(let i = 0; i < querySnapshot.docs.length; i++){
        const doc = querySnapshot.docs[i];
        
        const tempsubcategories = SubcategoriesFromData(doc.id, doc.data());

        if(tempsubcategories == undefined){
            continue;
        }

        tmp.push(tempsubcategories);
    }
    return tmp;
}

interface IIndexable {
    [key: string]: any;
}

export const subcategoriesGetNextOfField = async ( field:string) => {
    const subcolPath = "";
    const querySnapshot = await getDocs(query(collection(db, subcolPath+"subcategories"), orderBy(field, "desc"), limit(2)));
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

export const subcategoriesGetById = async ( id:string) => {
    const subcolPath = "";
    const docRes = await getDoc(doc(db, subcolPath+"subcategories/"+id));
    if(!docRes.exists())
        return;
    
    return SubcategoriesFromData(docRes.id, docRes.data());
}

export const SubcategoriesFromData = (id:string, data:any):SubcategoriesType|undefined => {
    const tempsubcategories = data ?? {};
        tempsubcategories.id = id;
        if(tempsubcategories.added != undefined && typeof tempsubcategories.added.toDate === 'function'){
            tempsubcategories.addedTime = DateTime.fromJSDate(tempsubcategories.added.toDate()).setLocale("es-mx");
        }
        

        const parseRes = SubcategoriesSchema.passthrough().safeParse(tempsubcategories);
        if(parseRes.success == false){
            console.log("error parseando",id,parseRes.error);
            return;
        }

        return parseRes.data;
}

export function subcategoriesValuesMapById(){ //
    const data = writable<Map<string,SubcategoriesType>>(new Map());
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
        const tmp = new Map<string,SubcategoriesType>(existing);
        for(let i = 0; i < toLoadArray.length; i+=25){
            toLoadBatches.push(toLoadArray.slice(i,i+25));
        }
        for(let i = 0; i < toLoadBatches.length; i++){
                try{
                const querySnapshot = await getDocs(query(collection(db, subcolPath+"subcategories"), where( documentId(), "in", toLoadBatches[i])));
                for(let i = 0; i < querySnapshot.docs.length; i++){
                    const doc = querySnapshot.docs[i];
                    
                    const tempsubcategories = SubcategoriesFromData(doc.id, doc.data());

                    if(tempsubcategories == undefined){
                        continue;
                    }

                    tmp.set(doc.id,tempsubcategories);
                }
            }catch(e){
                console.error("Error loading Subcategorias", e);
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
export let subcategories_byId:Map<string, SubcategoriesType> = new Map<string, SubcategoriesType>();
export const addSubcategories = async ( values:SubcategoriesType, docId?:string) =>{
    const subcolPath = "";
    values.added = timenow;
    if(docId != undefined && docId != ""){
        await setDoc(doc(db, subcolPath+ "subcategories/"+ docId), values, { merge: true });
        return docId;
    }
    const docRef = await addDoc(collection(db, subcolPath+ "subcategories"), values);
    return docRef.id;
}
export const updateSubcategories = ( docId:string, values:any) =>{
    const subcolPath = "";
    // values.modified = timenow;
    return updateDoc(doc(db, subcolPath+ "subcategories",docId), values);
}
export const deleteSubcategories = ( id:string|undefined)=> {
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
                    deleteDoc(doc(db,subcolPath + "subcategories",id));
                  //Swal.fire("Deleted!", "Your file has been deleted.", "success");
                }
            });
    
};

export const duplicateSubcategories = ( id:string|undefined)=> {
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
                    const basedoc = await getDoc(doc(db,subcolPath +  "subcategories",id));
                    if(basedoc.exists()){
                        addDoc(collection(db,subcolPath +  "subcategories"), basedoc.data());
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