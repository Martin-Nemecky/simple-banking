import * as _ from 'lodash';

// ========================================================================
// VOCABULARY
// ========================================================================
enum Conjuction {
    AND, OR
};

type DecisionRule<T> = {
    name: string;
    applyTo: (item: Readonly<T>) => boolean;
}

class MyCollection<T> {
    private items : T[] = [];

    constructor(items: T[]) {
        this.items = items;
    }

    /**
     * Filter items based on given rules. 
     * It is possible to chain the filter function calls because the return value is again the MyCollection<T> instance.
     * 
     * @param rules
     * @param options options that influence the filtering proccess (e. g. conjunction defines logical operator which should be applied between the rules)
     * @returns new instance of MyCollection<T> with filtered items
     */
    filter(rules: DecisionRule<T>[], options : { conjunction: Conjuction } = { conjunction: Conjuction.AND }): MyCollection<T> {
        const result : T[] = [];

        for(const item of this.items) {
            let matchesFilters = true;

            for(const rule of rules) {
                const isRuleSatisfied = rule.applyTo(item);

                if(options.conjunction === Conjuction.AND && isRuleSatisfied){
                    matchesFilters = true;
                    continue;
                } else if (options.conjunction === Conjuction.AND && !isRuleSatisfied) {
                    matchesFilters = false;
                    break;
                } else if (options.conjunction === Conjuction.OR && isRuleSatisfied){
                    matchesFilters = true;
                    break;
                } else {
                    matchesFilters = false;
                    continue;
                }
            }

            if(matchesFilters) {
                result.push(_.cloneDeep(item));
            }
        }

        return new MyCollection(result);
    }
}

// ========================================================================
// DATA
// ========================================================================
type Person = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    birthDate: number;
}

// Define people
const people : Person[] = [
    { id: "1", email: "smith@gmail.com", firstName: "John", lastName: "Smith", birthDate: new Date("1971, 2, 5").getTime() },
    { id: "2", email: "newman@gmail.com", firstName: "Elisa", lastName: "Newman", birthDate: new Date("1975, 6, 5").getTime() },
    { id: "3", email: "raider@gmail.com", firstName: "James", lastName: "Raider", birthDate: new Date("1999, 11, 1").getTime() },
    { id: "4", email: "raider2@gmail.com", firstName: "James", lastName: "Raider", birthDate: new Date("1973, 9, 2").getTime() },
    { id: "5", email: "rhodes@gmail.com", firstName: "Jenna", lastName: "Rhodes", birthDate: new Date("1989, 5, 7").getTime() },
    { id: "6", email: "goodman@gmail.com", firstName: "Alice", lastName: "Goodman", birthDate: new Date("2002, 1, 9").getTime() },
];

// Define rules
const rules : DecisionRule<Person>[] = [
    { name: 'RULE-1', applyTo: (item) => item.firstName === "James" },
    { name: 'RULE-2', applyTo: (item) => item.lastName === "Raider" },
    { 
        name: 'RULE-3',
        applyTo: (item) => {
            const diff =  Date.now() - item.birthDate;
            const age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
            return age > 50;
        }
    },
    // { name: 'YOUR NEW RULE ', applyTo: (item) => true },
];

// ========================================================================
// EXAMPLE USAGE
// ========================================================================

// Create instance of a collection
const collection = new MyCollection(people);

// Filter items based on rules
const result = collection.filter(rules, { conjunction: Conjuction.AND });

// Print the result
console.log(JSON.stringify(result, null, 2));


