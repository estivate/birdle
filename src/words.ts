import {GuessBirds, AllBirds } from './word_lists'


const filterToFit = ((word_list:string[]):string[]=> {
    const wordSize = 5;
    let newList:string[] = [];
    word_list.forEach((word) => {

        // lower case
        word = word.toLowerCase();

        // add five letter words
        if (word.length === wordSize) {
            newList.push(word);
            return;
        }
        // split multi-word names and add last word
        if (word.includes(' ')) {
            const parts:string[] = word.split(' ');
            const last = parts.pop()!;
            if (last.length === wordSize) {
              newList.push(last)
            }
          }
    })

    // dedupe the final list via Array -> Set -> Array
    newList = [...new Set(newList)];
    console.log(newList);
    return newList;

})

// condition the lists
export const AllWords = filterToFit(AllBirds);
export const GuessWords = filterToFit(GuessBirds);