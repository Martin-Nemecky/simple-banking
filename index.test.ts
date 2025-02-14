import { expect, test } from 'vitest'
import { ageGreaterThan, ageLessThan, Conjunction, DecisionRule, firstNameEquals, lastNameEquals, MyCollection, Person } from './index.js';

const people : Person[] = [
    { id: "1", email: "smith@gmail.com", firstName: "John", lastName: "Smith", birthDate: new Date("1971, 2, 5").getTime() },
    { id: "2", email: "newman@gmail.com", firstName: "Elisa", lastName: "Newman", birthDate: new Date("1979, 6, 5").getTime() },
    { id: "3", email: "raider@gmail.com", firstName: "James", lastName: "Raider", birthDate: new Date("1999, 11, 1").getTime() },
    { id: "4", email: "raider2@gmail.com", firstName: "James", lastName: "Raider", birthDate: new Date("1973, 9, 2").getTime() },
    { id: "5", email: "rhodes@gmail.com", firstName: "Jenna", lastName: "Rhodes", birthDate: new Date("1989, 5, 7").getTime() },
    { id: "6", email: "goodman@gmail.com", firstName: "Alice", lastName: "Goodman", birthDate: new Date("2002, 1, 9").getTime() },
];

test('test first name rule', () => {
    const rules : DecisionRule<Person>[] = [
        { name: 'RULE-1', applyTo: (item) => firstNameEquals(item, "James") },
    ];

    const collection = new MyCollection(people);
    const result = collection.filter(rules, { conjunction: Conjunction.AND });

    expect(result.getItems().length).toBe(2);
    expect(result.getItems().at(0)?.id).toBe('3');
    expect(result.getItems().at(1)?.id).toBe('4');
});

test('test last name rule', () => {
    const rules : DecisionRule<Person>[] = [
        { name: 'RULE-1', applyTo: (item) => lastNameEquals(item, "Goodman") },
    ];

    const collection = new MyCollection(people);
    const result = collection.filter(rules, { conjunction: Conjunction.AND });

    expect(result.getItems().length).toBe(1);
    expect(result.getItems().at(0)?.id).toBe('6');
});

test('test age greater than 50 rule', () => {
    const rules : DecisionRule<Person>[] = [
        { name: 'RULE-1', applyTo: (item) => ageGreaterThan(item, 50) },
    ];

    const collection = new MyCollection(people);
    const result = collection.filter(rules, { conjunction: Conjunction.AND });

    expect(result.getItems().length).toBe(2);
    expect(result.getItems().at(0)?.id).toBe('1');
    expect(result.getItems().at(1)?.id).toBe('4');
});

test('test age less than 50 rule', () => {
    const rules : DecisionRule<Person>[] = [
        { name: 'RULE-1', applyTo: (item) => ageLessThan(item, 50) },
    ];

    const collection = new MyCollection(people);
    const result = collection.filter(rules, { conjunction: Conjunction.AND });

    expect(result.getItems().length).toBe(4);
    expect(result.getItems().at(0)?.id).toBe('2');
    expect(result.getItems().at(1)?.id).toBe('3');
    expect(result.getItems().at(2)?.id).toBe('5');
    expect(result.getItems().at(3)?.id).toBe('6');
});

test('test no rule', () => {
    const rules : DecisionRule<Person>[] = [];

    const collection = new MyCollection(people);
    const result = collection.filter(rules, { conjunction: Conjunction.AND });

    expect(result.getItems().length).toBe(6);
    expect(result.getItems().at(0)?.id).toBe('1');
    expect(result.getItems().at(1)?.id).toBe('2');
    expect(result.getItems().at(2)?.id).toBe('3');
    expect(result.getItems().at(3)?.id).toBe('4');
    expect(result.getItems().at(4)?.id).toBe('5');
    expect(result.getItems().at(5)?.id).toBe('6');
});

test('test multiple rules', () => {
    const rules : DecisionRule<Person>[] = [
        { name: 'RULE-1', applyTo: (item) => firstNameEquals(item, "James") },
        { name: 'RULE-2', applyTo: (item) => ageLessThan(item, 50) },
    ];

    const collection = new MyCollection(people);
    const result = collection.filter(rules, { conjunction: Conjunction.AND });

    expect(result.getItems().length).toBe(1);
    expect(result.getItems().at(0)?.id).toBe('3');
});

test('test multiple rules with OR', () => {
    const rules : DecisionRule<Person>[] = [
        { name: 'RULE-1', applyTo: (item) => firstNameEquals(item, "James") },
        { name: 'RULE-2', applyTo: (item) => ageLessThan(item, 50) },
    ];

    const collection = new MyCollection(people);
    const result = collection.filter(rules, { conjunction: Conjunction.OR });

    expect(result.getItems().length).toBe(5);
    expect(result.getItems().at(0)?.id).toBe('2');
    expect(result.getItems().at(1)?.id).toBe('3');
    expect(result.getItems().at(2)?.id).toBe('4');
    expect(result.getItems().at(3)?.id).toBe('5');
    expect(result.getItems().at(4)?.id).toBe('6');
});