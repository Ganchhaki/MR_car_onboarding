import turtle

# Setup the turtle and screen
t = turtle.Turtle()
s = turtle.Screen()
s.bgcolor('black')
t.speed(0)

# Define the color palette
colors = ("yellow", "red", "pink", "cyan", "light green", "blue")

# Draw the pattern
for i in range(150):
    t.pencolor(colors[i % 6])
    t.circle(190 - i / 2, 90)
    t.lt(90)
    t.circle(190 - i / 3, 90)
    t.lt(60)

# Keep the window open until clicked
s.exitonclick()
