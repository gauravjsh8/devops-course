## What are the main responsibilities of the customer and the software engineer during requirements engineering? Discuss why both sides need to participate actively.

The responsibilities of the customer include generating defining business needs, setting priorities and giving feedbacks/final approval. Software engineers then elicit requirements and break them down into technical chunks that can be implemented. Both sides need to work together closely at this crucial step because unclear issues here will have greater costs later in development. Software engineering team should have deep meetings/interviews with customers to extract the information that they need with the approval of customers.

## Why is communication difficult during requirements analysis? As a team, identify common causes of misunderstanding and suggest ways to reduce them.

It is difficult because there is a gap in understanding a developer’s point of view as a customer and vice versa. So, close collaboration in requirements analysis can minimize these gaps so that both parties are on the same page.

## Requirements analysis focuses on what the system should do rather than how it should be implemented. Discuss why this separation is useful during early analysis.

Naturally, is it best to understand the requirements before discussing how to implement the steps. Implementation focuses on technical aspects that generate from requirements, so it is best to understand the customer’s needs first to avoid premature technical bias that can be costly to rework later in development.

## What information should an analyst collect during problem recognition? Create a list of questions that could help a team understand the customer's real problem.

The analysts should collect data on the pain points of the users, the triggers that could cause these problems to happen, how to detect them, what stakeholders are affected and a comparison between the overall as-is process and the desired change (success criteria).

- What are the pain points experienced by users currently?
- What is the current workaround for this problem
- What triggers cause this problem to occur?
- Who is affected by this problem, ranked from most affected to least?
- Is there someone negatively affected by the change to be implemented?
- What would a successful outcome look like for users?
- What is the minimum viable result?

## Compare a simple question-and-answer interview with the FAST approach. Discuss the strengths of each approach and explain when a team might prefer a collaborative meeting.

In a simple question-and answer interview, misunderstanding can occur a lot, important information can be omitted, and a successful working relationship can never be established. Its strength is that during the initial phase, when both analysts and customers are in dilemma about how to start and where it will take, it will help to start the communication that is essential to successful analysis. But this format has not been successful always. So, it should be used for the first encounter only during a meeting. On the other hand, In **FAST** method, a joint team of customers and developers work together to identify the problem, propose elements of the solution, negotiate different approaches and specify a preliminary set of solution requirements. Its strength is that both groups work together during requirements gathering and are applied during the early stages of analysis. A team always prefers collaborative meeting after the initial analysis has been done because it combines elements of problem solving, negotiation and specification.

## Design a FAST meeting for requirements gathering. Decide who should participate, what rules should be followed, how ideas should be recorded, and how the final consensus list should be created.

For **FAST** meeting, let’s take example of a Hotel Management System.
The participants can be Hotel manager, Receptionist, Hotel staffs, software engineer, Project manager.
For the meeting, the following rules should be followed.
- Everybody should get a chance to speak
- Listen to other people’s ideas and do not interrupt others
- No idea should be rejected immediately
- Focus on the real problem
- Try to reach an agreement
The ideas can be recorded in many ways like White board, sticky notes, or electronic way.
Final consensus should be created in the following way:
- Read all the requirements
- Remove duplicate requirements
- Explain unclear requirements
- Discuss conflicts
- Record the final agreed requirements

## What is the purpose of a mini specification? Discuss what information should be included in a good mini-specification and how it can help later development activities.

The purpose of a mini specification is to elaborate and give detailed description of the word or phrase contained on a list and help the developers understand a requirement better.
A good mini specification requires certain information to be included such as:
- Name of the function
- Purpose of the function
- Input and output information
- Error conditions
- Expected result
A mini specification can help later development activities when they are designing, coding, testing and checking the system.

## Compare the three QFD requirement types: normal, expected, and exciting. Create several examples for a software system and explain why each example belongs to its category.

Normal requirements are the features that customers directly ask for, and it should be included compulsorily. The customers are satisfied if these requirements are present. For example, for a hotel reservation system, customers ask for the features like guests can book rooms online, guests can cancel bookings, receptionist can see room bookings etc. Expected requirements are the features customers expect the system to have. These requirements are implicit in the product and may be so fundamental that the customer does not explicitly state them. Their absence will be a cause of significant dissatisfaction. For example, guest information should be safe, the system should not lose customer data, etc. Exciting requirements are the extra features that are not expected by the customers but prove to be very satisfying when present. For example, guests get a special welcoming message, the system automatically suggests nearby tourist places, etc.

## How can prototyping help when customers and developers are not completely sure about the requirements? Discuss its possible benefits for communication, understanding, and requirements refinement.

A prototype is an early and simple version of a system. It can show customers how the final system may look and work. Its benefits are as follows:
- customer can see the idea instead of only reading documents
- Developers can understand customer needs better
- Misunderstanding can be found early
- Missing requirements can be discovered

## How can FAST and QFD be used together during requirements engineering? Develop a team process that shows how customer needs could be collected, discussed, prioritized, and transformed into software requirements.

**FAST** and **QFD** can be used together to understand and organize customer needs. First, the team uses a **FAST** meeting to talk with the customer and collect their needs and ideas. Then the team discusses the ideas and removes duplicate or unclear ideas. After that **QFD** can be used to classify and prioritize the requirements as normal, expected or exciting. The team then changes the important customer’s needs into clean software requirements. Finally, the team shows the requirements to the customer, gets feedback and makes the final agreed requirements list. This process helps the customer and software team understand each other and build the right system
