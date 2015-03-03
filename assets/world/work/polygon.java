import java.io.*;
import java.util.*;

public class polygon {
	public static void main (String[] args) throws IOException {
      Scanner sc = new Scanner(System.in);
      String fileName;
      System.out.print("Filename (without extension): ");
      fileName = sc.nextLine();
		createNew(fileName);
		
		System.exit(0);
	}
	
   /**
	 * createNew(String filename)
	 * 
	 * Parses through the given file and creates Amlesh's thingy.
	 * 
	 * @param filename Name of the file for input
	 */
	public static void createNew(String filename) throws IOException {
		BufferedReader f = new BufferedReader(new FileReader(filename + ".txt"));
		PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("output.txt")));
      int height = 0;
      int lineNumber = 1;
      
		String line = f.readLine();
      while ( true ) {
         line = grabFormattedText(line.trim());
         if ( line.length() == 0 ) { // Commented or empty space
            line = f.readLine();
            lineNumber++;
         }else if ( isInt(line) ) {
            height = Integer.parseInt(line);
            break;
         } else { // Bad input -> end program.
            System.out.println("Bad input at line " + lineNumber + ": \"" + line + "\".");
            System.out.println("Expected image height.");
            out.close();
            return;
         }
      }
		
      boolean firstLine = true;
      boolean firstChunk = true;
      boolean EOF = false;
      float x1 = 0, y1 = 0;
      
      line = f.readLine();
      lineNumber++;
		while ( true ) {
         if ( !f.ready() ) {// Breaks at the end of the file
            EOF = true;
            
            if ( line.trim().length() == 0 )
               break;
         }
         
         line = grabFormattedText(line.trim());
         if ( line.length() > 0 ) {
            float x2 = 0, y2 = 0;
            String[] inputs = line.split(",");
            if ( inputs.length != 2 ) {
               System.out.println("Bad input at line " + lineNumber + ": \"" + line + "\".");
               out.close();
               return;
            }
            inputs[0] = inputs[0].trim();
            inputs[1] = inputs[1].trim();
            
            if (isFloat(inputs[0]) && isFloat(inputs[1])) {
               x2 = Float.parseFloat(inputs[0]);
               y2 = Float.parseFloat(inputs[1]);
               
               if ( firstLine ) {
                  firstLine = false;
               } else {
                  if ( firstChunk )
                     firstChunk = false;
                  else
                     out.println(",");
                  
                  out.println("{");
                  out.println("\t\"density\": 200, \"friction\": 0, \"bounce\": 0,");
                  out.println("\t\"filter\": { \"categoryBits\": 1, \"maskBits\": 65535 },");
                  out.println("\t\"shape\": [" + x1 + "," + y1 + " , " + x2 + "," + y2 + " , " 
                              + x2 + "," + height + " , " + x1 + "," + height + "]");
                  out.println("}");
               }
               
               x1 = x2;
               y1 = y2;
            } else { // Bad input -> end program
               System.out.println("Bad input at line " + lineNumber + ": \"" + line + "\".");
               out.close();
               return;
            }
         }
         
         if ( EOF )
            break;
			line = f.readLine();
         lineNumber++;
		}
		
		out.close();
	}
	
   /**
    * grabFormattedText(String line)
    * 
    * Grabs the current line and formats it into
    * a readable input. Returns a null string
    * if it's a comment block
    *
    * @param line Line of input
    * @return Formatted line of input
    */
	public static String grabFormattedText(String line) {
      String[] temp = line.split("#");
      line = temp[0].trim();
      
		return line;
	}
   
   /**
	 * isInt(String input)
	 * 
	 * Parses a String for an Integer and returns
	 * True or False depending on if the String
	 * is an Integer
	 * 
	 * @param input String to be parsed for Integer
	 * @return True if valid Integer, false otherwise
	 */
	public static boolean isInt(String input) {
		try {
			Integer.parseInt(input);
		} catch (Exception e) {
			return false;
		}
		return true;
	}
   
   /**
	 * isFloat(String input)
	 * 
	 * Parses a String for a Float and returns
	 * True or False depending on if the String
	 * is a Float
	 * 
	 * @param input String to be parsed for Float
	 * @return True if valid Float, false otherwise
	 */
	public static boolean isFloat(String input) {
		try {
			Float.parseFloat(input);
		} catch (Exception e) {
			return false;
		}
		return true;
	}
}
