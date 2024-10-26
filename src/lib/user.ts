import {readable, derived, get, writable} from 'svelte/store';
import {browser} from '$app/environment';
import type {User, Auth, ParsedToken}
from 'firebase/auth';
import type {Firestore}
from 'firebase/firestore';
import {goto} from '$app/navigation';
import {page} from '$app/stores';
import {profileNode, singInMethods} from './app';
import { redirect } from '@sveltejs/kit';

export const permissions = writable < ParsedToken > ({});

export const createAuth = (loginPage="/login", loginRoute ="/(reset)/login") => {
    let auth: Auth |null = null;

    const {subscribe} = readable < User | null > (undefined, (set) => {
        let unsubscribe = () => {
            console.log("no unsub auth");
        };

        async function listen() {
            console.log("listening auth");
            if (browser) {
                console.log("in browser auth");
                auth = (await import ('./app')).auth;
                console.log("loaded app auth");
                const {onAuthStateChanged} = await import ('firebase/auth');
                console.log("loaded auth");

                unsubscribe = onAuthStateChanged(auth, async (u) => {
                    console.log("auth", u);
                    set(u);

                    if (u == null || u == undefined) {
                        if (auth != null) {
                            const current_page = get(page);
                            if ('anon' in singInMethods && singInMethods.anon ) {
                                const {signInAnonymously} = await import ('firebase/auth');
                                try {
                                    signInAnonymously(auth);
                                } catch (ex) {
                                    console.log("No anonymous sign in");
                                    if(current_page.route.id != loginRoute){
                                        goto(loginPage+"?to=" + current_page.url.pathname);
                                    }

                                }
                            } else {
                                if(current_page.route.id != loginRoute){
                                    // console.log("redirect to login", current_page.url.pathname, loginPage);
                                    goto(loginPage+"?to=" + current_page.url.pathname);
                                }
                            }

                        }

                    } else {
                        u.getIdTokenResult().then((idresult) => {
                            console.log('got claims', idresult);
                            permissions.set(idresult.claims);

                        });
                        console.log('got user', u);
                    }
                });
            } else {
                set(null);
                console.log("no browser auth");
				if (!('anon' in singInMethods && singInMethods.anon)) {
                    console.log("redeirect to login");
                    // goto(loginPage);
					// redirect(304, loginPage);
				}
            }
        }

        listen();

        return() => unsubscribe();
    });

    async function providerFor(name: string) {
        const {GoogleAuthProvider} = await import ('firebase/auth');
        switch (name) {
            case 'google':
                return new GoogleAuthProvider();
            default:
                throw 'unknown provider ' + name;
        }
    }

    async function signInWith(name: string) {
        const {signInWithRedirect} = await import ('firebase/auth');
        const provider = await providerFor(name);
        if (auth != null) {
            return signInWithRedirect(auth, provider);
        }

    }

    async function signInEmail(email: string, pass: string) {
        const {signInWithEmailAndPassword} = await import ('firebase/auth');
        if (auth != null) {
            return signInWithEmailAndPassword(auth, email, pass);
        }
    }

    async function signOut() {
        const {signOut} = await import ('firebase/auth');
        if (auth != null) {
            await signOut(auth);
        }
    }

    async function createUserWithEmailAndPassword(email: string, password: string) {
        const {createUserWithEmailAndPassword} = await import ("firebase/auth");
        if (auth != null) {
            return createUserWithEmailAndPassword(auth, email, password);
        }
    }

    async function resetPassword(email: string) {
        const {sendPasswordResetEmail} = await import ("firebase/auth");
        if (auth != null) {
            return sendPasswordResetEmail(auth, email);
        }
    }

    async function resetPasswordConfirm(code: string, newPassword: string) {
        const {confirmPasswordReset} = await import ("firebase/auth");
        if (auth != null) {
            return confirmPasswordReset(auth, code, newPassword);
        }
    }

    return {
        subscribe,
        signInEmail,
        createUserWithEmailAndPassword,
        signInWith,
        signOut,
        resetPassword,
        resetPasswordConfirm
    };
};

export const user = createAuth();

export const createProfile = (userStore= user,pNode = profileNode) => {
    let unsubscribe = () => {
        console.log("no unsub profile");
    };
    let db: Firestore |null = null;
    // const _select = writable('H')
    const _list = derived<typeof user, unknown>(userStore, ($user, set) => {
        if ($user == null || $user == undefined) {
            set({});
            return() => unsubscribe();
        }
        // $user.find(a => a.id == $_select)
        async function listen() {
            if (browser) {
                if ($user == null) {
                    return;
                }
                db = (await import ('./app')).db;
                const {doc, onSnapshot} = await import ('firebase/firestore');
                try {
                    const q = doc(db, pNode, $user.uid);
                    unsubscribe = onSnapshot(q, (querySnapshot) => {
                        let prof: any = {};
                        if (querySnapshot.data() != undefined) {
                            prof = querySnapshot.data();
                            prof.id = querySnapshot.id;
                        }
                        console.log('Current profile: ', prof);
                        set(prof);
                    });
                } catch (err) {
                    console.log("cant read profile");
                }

            } else {
                set({});
            }
        }

        listen();

        return() => unsubscribe();
    });

    async function addField(field: string, value: any) {
        if (db == null) {
            return;
        }
        const {doc, setDoc} = await import ('firebase/firestore');
        const u = get(user);
        if (u == null || u == undefined) {
            console.log('no user');
            return;
        }
        // console.log(db, "channels_user", u.uid, "selected", channel.id);
        // console.log(db, u, channel);
        await setDoc(doc(db, 'profile', u.uid), {
            [field]: value
        }, {merge: true});
    }
    async function removeField(field: string) {
        if (db == null) {
            return;
        }
        const {doc, deleteField, updateDoc} = await import ('firebase/firestore');
        const u = get(user);
        if (u == null || u == undefined) {
            console.log('no user');
            return;
        }
        console.log(field);
        await updateDoc(doc(db, 'profile', u.uid), {[field]: deleteField()});
    }

    return {
        addField: addField,
        removeField: removeField,
        ... _list
    };
};
export const profile = createProfile();
