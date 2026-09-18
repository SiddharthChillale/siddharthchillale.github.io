---
title: "Behavioural Design Patterns in C++"
date: 2023-01-24T11:46:00-05:00
draft: false
summary: "Condensed notes on the behavioural design patterns in C++ — chain of responsibility, command, mediator, observer, state, visitor and the rest — with small code sketches for each."
showToc: true
---
Design patterns in C++ are ways to structure code so as to maximise code reusability and versatility. Below are some of the keypoints of the different behavioural design patterns in C++ condensed into quick bites from a course on LinkedIn Learning.
### Chain of Responsibility

for series of nested handlers

kinda like the middleware in express js

``` cpp
class Handler&#123;
	virtual Handler* setNext (Handler* nextHandler) = 0;
	virtual Command* handle(Command* cmd)=0;
&#125;;
```

### Command

To reduce coupling between classes that call one another.

Introduce a third middle class that reduces this coupling. e.g. A button class does not need to have a handle to the canvas. It can have a handle to the command class which in turn has a handle to the canvas it wants to run the command in.

1. ClearCanvasCommand  - */ &#125; Command Interface (Inheritance)
2. Button
			members
			=>[ Command* cmd] // takes a command type in constructor
			=>[ onclick() calls cmd->execute()]

```cpp
class Command&#123;
	virtual void execute() = 0;
&#125;;

class ClearCanvasCommand : Command&#123;
	Canvas* canvas;
	void execute() override&#123;
		canvas->clearAll();
	&#125;
&#125;;

class AddShapeCommand : Command&#123;
	Canvas* canvas;
	Shape* shape;
	// <--constructor */ &#125;
	void execute() override &#123;
		canvas->addShape(shape);
	&#125;

&#125;;

class Button&#123;
	Command* command;
	// <--constructor */ &#125;
	virtual void click() &#123;
		command->execute();
	&#125;
&#125;;
```

### Mediator

Reduce coupling between complex object dependencies.

Allow an instance of mediator to facilitate communication between different objects. e.g. UI object has TextBox, CheckBox, ButtonElement

```cpp
Mediator&#123;
virtual void mediate();
&#125;;

UserInterface : Mediator&#123;
tb = new TextBox;
cb = new CheckBox;
bu = new ButtonElement;

virtual void mediate(string eventstring) override&#123;
	switch(eventstring)&#123;
		case textbox: tb->doSomething();
		case checkbox: cb->doItsThing();
		case buttonelement: bu->click();
&#125;
&#125;;
```

### Observer

When we want only the objects that care about certain events to be notified of the change in occurence. This is a publisher and subscriber implementation.

```cpp
class Subscriber&#123;
	virtual void notify(Publisher p, message m);
&#125;;

class Publisher &#123;
	virtual void subscribe(Subscriber s);
	virtual void unsubscribe(Subscriber s);
	virtual void publish(message m);
&#125;;

class ChatGroup : Publisher&#123;
vector<Subscribers> scp;
// when a subscriber subscribes, add it to the vector scp;
// when a subscriber unsubs, remove it from the vector scp;
// in publish, call the notify() function of all subscribers in the vector scp
	void publish() override &#123;
		for(auto& sub : scp)&#123;
			sub->notify();
		&#125;
	&#125;;
&#125;;

class ChatUser : Subscriber&#123;
	void notify() override &#123;&#125; ; // subscriber needs to implement this
&#125;;

```

### Interpreter

When program needs the ability to interface with some sort of language outside its normal comprehension. e.g. understanding and executing mathematical expressions, understanding human languages like eng/ spanish or roman numerals.

```cpp
class Expression &#123;
	virtual void evaluate() = 0;
&#125;;

class OperationExpression : Expression&#123;
	std::string op;
	Expression* lhs;
	Expression* rhs;
	int evaluate()&#123;
		switch(op):
			case "+" : return lhs->evaluate() + rhs->evaluate();
			case "-" : return lhs->evaluate() - rhs->evaluate();
			case "*" : return lhs->evaluate() * rhs->evaluate();
			case "/" : return lhs->evaluate() / rhs->evaluate();
			case default: return 0;
	&#125;
&#125;;

class NumberExpression : Expression&#123;
	std::string op;
	void evaluate()&#123;
		return std::stoi(op);
	&#125;
&#125;;
```

### State

when a class can be in different state and needs to change behavior according to this state.

```cpp
class State &#123;
	State* next = nullptr;
	State(State* nextState) : next(nextState)&#123;&#125;;

	virtual State* getNext() &#123;
		return next;
	&#125;

	// can be any function that operates differently based
	// on which state the object is in. for illustration,
	// getDescription is used
	virtual string getDescription() = 0;
&#125;;

class PurchasedState : State &#123;
	PurchasedState(State* nextState): State(nextState)&#123;&#125;
	string getDescription() override&#123;
		return "Purchased";
	&#125;
&#125;;

class InTransitState : State &#123;
	InTransitState(State* nextState): State(nextState)&#123;&#125;
	string getDescription() override&#123;
		return "InTransit";
	&#125;

&#125;;

class DeliveredState : State &#123;
	DeliveredState (State* nextState): State(nextState)&#123;&#125;
	string getDescription() override&#123;
		return "Delivered";
	&#125;

&#125;;

class Order&#123;
	State* s;
	Order (State* curState) : s(curState)&#123;&#125;;
	void goToNext()&#123;
		s = s->getNext();
	&#125;
	string getCurStateDescription&#123;
		if(!s) return "No states";
		return s->getDescription();
	&#125;
&#125;;

void main()&#123;
	DeliveredState* ds = new DeliveredState(nullptr);
	InTransitState* is = new InTransitState(ds);
	PurchasedState* ps = new PurchasedState(is);
	Order o(ps);
	o->getDescription(); // returns "Purchased"

	o->gotToNext();
	o->getDescription(); // returns "InTransit"

	o->gotToNext();
	o->getDescription(); // returns "Delivered"

	o->gotToNext();
	o->getDescription(); // returns "No states"
&#125;
```

### Strategy

when program needs to choose between several different ways of doing things on the fly.

just like state pattern, but no linking of different strategies to inter-convert them.

### Template Method

Break entire process into a series of steps, represent each step as a method, and have each different process implement its own steps with their particular variations.

```cpp
GreetingCardTemplate&#123;
	virtual std::string heading(std::string& to)&#123;
		return "Hello" + to;
	&#125;
	virtual std::string ocassion()&#123;
		return "Thank you blah blah";
	&#125;
	virtual std::string footer(std::string& from)&#123;
		return "Warm regards, " + from
	&#125;
	std::string generate(std::string& to, std::string& from)&#123;
		return heading(to) + ocassion() + footer(from);
	&#125;
&#125;;

BirthdayCardTemplate : GreetingCardTemplate&#123;
	std::string ocassion() override&#123;
		return "Happy Birthday";
	&#125;
&#125;;

DiwaliCardTemplate : GreetingCardTemplate&#123;
	std::string ocassion() override&#123;
		return "Shubh Dipawali !!";
	&#125;

	virtual std::string footer(std::string& from)&#123;
		return "From entire family, 🪔 " + from
	&#125;
&#125;;

void main()&#123;
	DiwaliCardTemplate dct;
	BirthdayCardTemplate bct;

	string diwaliLetter = dct.generate("Raju Chacha", "Ambani");
	string bdayLetter = bct.generate("Ranchoddas Chanchad", "Rastogi");
	string bdayLetter = bct.generate("Farhan", "Rastogi");
&#125;
```

### Visitor

Add similar extraneous functionality to different classes.

```cpp
class Visitor&#123;
	virtual	void handleA(string name)&#123;&#125;;
	virtual void handleB(datetime time)&#123;&#125;;
&#125;;

class DatabaseVisitor : Visitor&#123;
	void handleA(string name)&#123;
		// save to a database
	&#125;;
	void handleB(string action)&#123;
		// save to a database
	&#125;;
&#125;;

class FileSysVisitor : Visitor&#123;
	void handleA(string name, int phone)&#123;
		// save to a filesystem
	&#125;
	void handleB(datetime timestamp, string action)&#123;
		// save to filesystem
	&#125;
&#125;;
class A&#123;
	// Some members
	string name;
	int phone;

	void accept(Visitor& v);
&#125;;

class B&#123;
	// Some members
	string action;
	datetime time;

	void accept(Visitor& v);
&#125;;

void main()&#123;
	B bObj(action, currentTime);
	A aObj("Rohan", 9879879879);

	DatabaseVisitor dbv;
	FileSystemVisitor fsv;

	aObj.accept(dbv);   // uses dbv to save aObj to database
	aObj.accept(fsv);   // uses fsv to save aObj to filesystem

	//same for bObj
	bObj.accept(dbv);
	bObj.accept(fsv);

&#125;

```

### Iterator Pattern

A way to travel through some container. This implements a next() function which enables  the iteration of elements in the container.

### Memento

allow some objects to save themselves in such a way that they can’t be modified until they say so. Maintain a vector of const class objects. imagine history of objects, push a const copy of every valid state of object in a vector/ stack. When undo is clicked, clear the current object and fill it with the latest copy from the vector/ stack.

```cpp
class Canvas;

class CanvasMemento &#123;
	friend class Canvas;
	const vector<Shape> shapes;
	CanvasMemento(vector<Shape> shapes) : shapes(shapes) &#123;&#125;;
&#125;;

class Canvas &#123;
	vector<Shape> shapes;
	vector<CanvasMemento*> oldStates;
	Canvas()&#123;&#125;;
	void addShapes(Shape new_shape)&#123;
		oldStates.push_back(new CanvasMemento(shapes));
		shapes.add(new_shape);
	&#125;;
	void undo()&#123;
		shapes = oldStates.back()->shapes;
		cm.shapes.pop_back();
	&#125;;
&#125;;
```

### Null-Object

Instead of using raw null pointers to inititalize member variables, use a default object to initialise it to.

```cpp
class Node&#123;
	int val;
	virtual	int getVal()&#123;
		return val;
	&#125;;
&#125;;

class ListNode : Node &#123;
	Node* next = nullptr;
	int getNextVal()&#123;
		return next->getVal();
		// this will throw null object error,
		//if next is not assigned any object
	&#125;;
&#125;;

///////////////////////

class NullNode : Node&#123;
	int getNextVal() &#123;return 0;&#125;
&#125;;

class ListNode : Node &#123;
	Node* next = new NullNode;
	int getNextVal()&#123;
		return next->getVal();
		// this will not throw error.
		// The uninitialized object has val set to 0
	&#125;;
&#125;;
```

💡 **Composition vs Inheritance:**
Difference between having a parent class and having the same class as a member variable:  Having a parent class means that you can handle the child class’s parent members by casting the handle of the child class to a pointer of parent class. Having an object of the parent class as a member doesn’t grant you this capability.

