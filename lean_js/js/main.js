function giaiptb1(a,b)
 {
    if (a == 0) {
        if (b == 0) {
            return "Phương trình vô số nghiệm";
        } else {
            return "Phương trình vô nghiệm";
        }
    } else {
        var x = -b / a;
        return "Phương trình có nghiệm x = " + x;
    }
}

function giaiptb2(a, b, c) {
    if (a == 0) {
        return giaiptb1(b, c);
    } else {
        var delta = b * b - 4 * a * c;    
        if (delta < 0) {
            return "Phương trình vô nghiệm";
        } else if (delta == 0) {
            var x = -b / (2 * a);
            return "Phương trình có nghiệm kép x = " + x;
        } else {
            var x1 = (-b + Math.sqrt(delta)) / (2 * a);
            var x2 = (-b - Math.sqrt(delta)) / (2 * a);
            return "Phương trình có hai nghiệm phân biệt x1 = " + x1 + ", x2 = " + x2;
        }
    }
}