# FriedStream

FriedStream is a secure, cross-platform screen streaming system inspired by AirPlay-style casting.

The project goal is to let one device stream its screen to another device using WebRTC, while preventing unsafe open-casting behavior through short-lived pairing codes and manual receiver approval.

## Core Idea

```txt
Receiver creates room
-> Receiver displays short-lived pairing code
-> Sender enters code
-> Receiver approves sender
-> WebRTC stream begins
